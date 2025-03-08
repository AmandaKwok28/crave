import { Recipe } from '@prisma/client';
import { prisma } from '../../prisma/db';

/**
 * Calculate similarity between two recipes
 */
async function calculateSimilarity(recipe1Id: number, recipe2Id: number): Promise<number> {
  // Get feature vectors for both recipes
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
  
  // Calculate cosine similarity between the vectors
  return calculateCosineSimilarity(vector1.vector, vector2.vector);
}

/**
 * Basic fallback similarity calculation when feature vectors aren't available
 */
async function calculateBasicSimilarity(recipe1Id: number, recipe2Id: number): Promise<number> {
  // Get recipe data with ingredients
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
  
  // Initialize similarity score
  let score = 0;
  
  // 1. Compare ingredients (most important factor)
  const ingredients1 = new Set(recipe1.ingredients.map(i => i.toLowerCase()));
  const ingredients2 = new Set(recipe2.ingredients.map(i => i.toLowerCase()));
  
  // Find common ingredients
  const commonIngredients = Array.from(ingredients1).filter(i => ingredients2.has(i));
  
  // Calculate Jaccard similarity for ingredients
  const totalUniqueIngredients = new Set([...recipe1.ingredients, ...recipe2.ingredients].map(i => i.toLowerCase())).size;
  if (totalUniqueIngredients > 0) {
    score += 0.6 * (commonIngredients.length / totalUniqueIngredients);
  }
  
  // 2. Same author bonus
  if (recipe1.authorId === recipe2.authorId) {
    score += 0.2;
  }
  
  // 3. Title similarity
  const title1 = recipe1.title.toLowerCase();
  const title2 = recipe2.title.toLowerCase();
  
  // Simple check for shared words in titles
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

export async function processRecipeSimilarities(recipeId: number, maxSimilarities: number = 10) {
  const baseRecipe = await prisma.recipe.findUnique({
    where: { 
      id: recipeId,
      published: true  // Ensure we only process published recipes
    }
  });

  if (!baseRecipe) {
    console.log(`Skipping similarity processing: Recipe ${recipeId} not found or not published`);
    return;
  }
  
  // Get all other published recipes
  const otherRecipes = await prisma.recipe.findMany({
    where: { 
      id: { not: recipeId },
      published: true
    }
  });
  
  type SimilarityEntry = {
    baseRecipeId: number;
    similarRecipeId: number;
    similarityScore: number;
  };

  // Calculate all similarities
  const similarities: SimilarityEntry[] = [];
  for (const recipe of otherRecipes) {
    const score = await calculateSimilarity(recipeId, recipe.id);
    similarities.push({
      baseRecipeId: recipeId,
      similarRecipeId: recipe.id,
      similarityScore: score
    });
  }
  
  // Process in a transaction with increased timeout
  await prisma.$transaction(
    async (tx) => {
      // STEP 1: Insert all new similarities (upsert to handle existing relationships)
      for (const similarity of similarities) {
        await tx.recipeSimilarity.upsert({
          where: {
            baseRecipeId_similarRecipeId: {
              baseRecipeId: similarity.baseRecipeId,
              similarRecipeId: similarity.similarRecipeId
            }
          },
          update: { similarityScore: similarity.similarityScore },
          create: similarity
        });
        
        // Also create/update the reverse relationship
        await tx.recipeSimilarity.upsert({
          where: {
            baseRecipeId_similarRecipeId: {
              baseRecipeId: similarity.similarRecipeId,
              similarRecipeId: similarity.baseRecipeId
            }
          },
          update: { similarityScore: similarity.similarityScore },
          create: {
            baseRecipeId: similarity.similarRecipeId,
            similarRecipeId: similarity.baseRecipeId,
            similarityScore: similarity.similarityScore
          }
        });
      }
      
      // STEP 2: Trim excess similarities for the base recipe
      // Find all similarities for this recipe, ordered by score (thanks to the index)
      const allBaseSimilarities = await tx.recipeSimilarity.findMany({
        where: { baseRecipeId: recipeId },
        orderBy: { similarityScore: 'desc' }
      });
      
      // If we have more than maxSimilarities, delete the excess
      if (allBaseSimilarities.length > maxSimilarities) {
        const toRemove = allBaseSimilarities.slice(maxSimilarities);
        for (const similarity of toRemove) {
          await tx.recipeSimilarity.delete({
            where: {
              baseRecipeId_similarRecipeId: {
                baseRecipeId: similarity.baseRecipeId,
                similarRecipeId: similarity.similarRecipeId
              }
            }
          });
        }
      }
      
      // STEP 3: Trim excess similarities for other recipes
      for (const otherRecipe of otherRecipes) {
        const allOtherSimilarities = await tx.recipeSimilarity.findMany({
          where: { baseRecipeId: otherRecipe.id },
          orderBy: { similarityScore: 'desc' }
        });
        
        // If this recipe has too many similarities, trim the excess
        if (allOtherSimilarities.length > maxSimilarities) {
          const toRemove = allOtherSimilarities.slice(maxSimilarities);
          for (const similarity of toRemove) {
            await tx.recipeSimilarity.delete({
              where: {
                baseRecipeId_similarRecipeId: {
                  baseRecipeId: similarity.baseRecipeId,
                  similarRecipeId: similarity.similarRecipeId
                }
              }
            });
          }
        }
      }
    },
    { 
      timeout: 10000 // 10 second timeout
    }
  );
}

/**
 * Get similar recipes for a given recipe
 */
export async function getSimilarRecipes(recipeId: number, limit: number = 3) {
  const similarities = await prisma.recipeSimilarity.findMany({
    where: { baseRecipeId: recipeId },
    orderBy: { similarityScore: 'desc' },
    take: limit,
    include: { similarRecipe: true }
  });
  
  return similarities.map(sim => sim.similarRecipe);
}