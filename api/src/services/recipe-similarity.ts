import { prisma } from '../../prisma/db';

/**
 * Calculate similarity between two recipes
 */
async function calculateSimilarity(recipe1Id: number, recipe2Id: number): Promise<number> {
  const vector1 = await prisma.recipeFeatureVector.findUnique({
    where: { recipeId: recipe1Id }
  });
  
  const vector2 = await prisma.recipeFeatureVector.findUnique({
    where: { recipeId: recipe2Id }
  });
  
  // If either recipe doesn't have a vector yet, fall back to basic similarity
  if (!vector1?.vector || !vector2?.vector) {
    return calculateBasicSimilarity(recipe1Id, recipe2Id);
  }
  
  return calculateCosineSimilarity(vector1.vector, vector2.vector);
}

/**
 * Basic fallback similarity calculation when feature vectors aren't available (likely usless)
 */
async function calculateBasicSimilarity(recipe1Id: number, recipe2Id: number): Promise<number> {
  // Get recipe data
  const recipe1 = await prisma.recipe.findUnique({
    where: { id: recipe1Id },
    select: { ingredients: true, title: true, authorId: true }
  });
  
  const recipe2 = await prisma.recipe.findUnique({
    where: { id: recipe2Id },
    select: { ingredients: true, title: true, authorId: true }
  });
  
  if (!recipe1 || !recipe2) {
    throw new Error(`One or both recipes not found: ${recipe1Id}, ${recipe2Id}`);
  }
  
  let score = 0;
  
  const ingredients1 = new Set(recipe1.ingredients.map(i => i.toLowerCase()));
  const ingredients2 = new Set(recipe2.ingredients.map(i => i.toLowerCase()));
  
  const commonIngredients = Array.from(ingredients1).filter(i => ingredients2.has(i));
  
  // Calculate Jaccard similarity for ingredients (intersection over union)
  const totalUniqueIngredients = new Set([...recipe1.ingredients, ...recipe2.ingredients].map(i => i.toLowerCase())).size;
  if (totalUniqueIngredients > 0) {
    score += 0.6 * (commonIngredients.length / totalUniqueIngredients);
  }
  
  // Same author bonus
  if (recipe1.authorId === recipe2.authorId) {
    score += 0.2;
  }
  
  // Title similarity
  const title1 = recipe1.title.toLowerCase();
  const title2 = recipe2.title.toLowerCase();
  
  const words1 = new Set(title1.split(/\s+/).filter(w => w.length > 3));
  const words2 = new Set(title2.split(/\s+/).filter(w => w.length > 3));
  const commonWords = Array.from(words1).filter(w => words2.has(w));
  
  if (words1.size > 0 && words2.size > 0) {
    score += 0.2 * (commonWords.length / Math.max(words1.size, words2.size));
  }
  
  // sigmoid function to normalize score between 0 and 1
  return 1 / (1 + Math.exp(-5 * (score - 0.5)));
}

/**
 * Calculate cosine similarity between two vectors
 */
function calculateCosineSimilarity(v1: number[], v2: number[]): number {
  // Dot product
  const dotProduct = v1.reduce((sum, v, i) => sum + v * v2[i], 0);
  
  // Magnitudes
  const mag1 = Math.sqrt(v1.reduce((sum, v) => sum + v * v, 0));
  const mag2 = Math.sqrt(v2.reduce((sum, v) => sum + v * v, 0));
  
  if (mag1 === 0 || mag2 === 0) return 0;
  
  return dotProduct / (mag1 * mag2);
}


/**
 * Update recipe similarities tables when creating or updating a recipe
 */
export async function batchProcessRecipeSimilarities(recipeIds: number[], maxSimilarities: number = 10): Promise<void> {
  console.log(`Batch processing similarities for ${recipeIds.length} recipes`);
  
  // 1. Get all base recipes that are published
  const baseRecipes = await prisma.recipe.findMany({
    where: {
      id: { in: recipeIds },
      published: true
    },
    select: { id: true }
  });

  const baseRecipeIds = baseRecipes.map(r => r.id);

  if (baseRecipeIds.length === 0) {
    console.log('No published recipes found in the batch');
    return;
  }

  // 2. Get all other published recipes
  const otherRecipes = await prisma.recipe.findMany({
    where: {
      id: { notIn: baseRecipeIds },
      published: true
    },
    select: { id: true }
  });
  
  // 3. Pre-fetch all feature vectors in one go
  const allRecipeIds = [...baseRecipeIds, ...otherRecipes.map(r => r.id)];
  const featureVectors = await prisma.recipeFeatureVector.findMany({
    where: { recipeId: { in: allRecipeIds } }
  });
  
  const vectorMap = new Map(featureVectors.map(v => [v.recipeId, v.vector]));

  // 4. Calculate all pairwise similarities
  const similarityEntries: Array<{
    baseRecipeId: number;
    similarRecipeId: number;
    similarityScore: number;
  }> = [];

  // For each base recipe
  for (const baseId of baseRecipeIds) {
    const baseVector = vectorMap.get(baseId);
    
    // Skip if no vector available
    if (!baseVector) {
      console.log(`No feature vector for recipe ${baseId}, skipping...`);
      continue;
    }
  
    // Calculate similarity with all other recipes
    for (const otherId of allRecipeIds) {
      // Skip self-comparison
      if (baseId === otherId) continue;
      
      const otherVector = vectorMap.get(otherId);
      if (!otherVector) continue;
      
      const score = calculateCosineSimilarity(baseVector, otherVector);
      
      // Add both directions for symmetry
      similarityEntries.push({
        baseRecipeId: baseId,
        similarRecipeId: otherId,
        similarityScore: score
      });
      
      // Always add the reverse relationship too
      similarityEntries.push({
        baseRecipeId: otherId,
        similarRecipeId: baseId,
        similarityScore: score
      });
    }
  }

  await prisma.$transaction(async (tx) => {
    // 5. Delete existing similarities for all base recipes
    await tx.recipeSimilarity.deleteMany({
      where: {
        OR: [
          { baseRecipeId: { in: baseRecipeIds } },
          { similarRecipeId: { in: baseRecipeIds } }
        ]
      }
    });

    // 6. Insert all calculated similarities
    // Use chunks to avoid hitting statement size limits
    const chunkSize = 500;
    for (let i = 0; i < similarityEntries.length; i += chunkSize) {
      const chunk = similarityEntries.slice(i, i + chunkSize);
      await tx.recipeSimilarity.createMany({
        data: chunk,
        skipDuplicates: true
      });
    }

    // 7. Get ALL affected recipes since changes to any recipe can affect similarity rankings for all recipes
    const affectedRecipeIds = Array.from(new Set(allRecipeIds));
    console.log(`Processing similarity trimming for ${affectedRecipeIds.length} total affected recipes`);

    // 8. Trim excess similarities for all affected recipes
    for (const recipeId of affectedRecipeIds) {
      const allSimilarities = await tx.recipeSimilarity.findMany({
        where: { baseRecipeId: recipeId },
        orderBy: { similarityScore: 'desc' }
      });
      
      if (allSimilarities.length > maxSimilarities) {
        const toRemove = allSimilarities.slice(maxSimilarities);
        
        // Delete excess similarities in bulk
        await tx.recipeSimilarity.deleteMany({
          where: {
            OR: toRemove.map(sim => ({
              AND: [
                { baseRecipeId: sim.baseRecipeId },
                { similarRecipeId: sim.similarRecipeId }
              ]
            }))
          }
        });
        
      }
    }
  }, {
    timeout: 15000 // Extended timeout for larger batches
  });

  console.log(`Successfully processed similarities for ${baseRecipeIds.length} recipes`);
}

// Maintain backward compatibility
export async function processRecipeSimilarities(recipeId: number, maxSimilarities: number = 10): Promise<void> {
  return batchProcessRecipeSimilarities([recipeId], maxSimilarities);
}