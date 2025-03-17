import { prisma } from '../../prisma/db.js';
import { generateBatchFeatureVectors } from './feature-vector.js';
import { batchProcessRecipeSimilarities } from './recipe-similarity.js';

export async function processUnvectorizedRecipes(batchSize = 10, maxSimilarities = 10) {
  console.log('Starting vector generation for recipes without vectors');
  
  const recipes = await prisma.recipe.findMany({
    where: {
      published: true,
      featureVector: null
    },
    take: batchSize, // Process in small batches to avoid overloading
    orderBy: { createdAt: 'asc' }, // Prioritize oldest recipes first
  });
  
  if (recipes.length === 0) {
    console.log('No recipes found without feature vectors');
    return;
  }
  
  console.log(`Processing ${recipes.length} recipes without feature vectors`);
  
  try {
    // STEP 1: Extract all recipe IDs
    const recipeIds = recipes.map(recipe => recipe.id);
  
    // STEP 2: Generate feature vectors for ALL recipes in a single batch call
    console.log(`Generating feature vectors for batch of ${recipeIds.length} recipes`);
    const vectorMap = await generateBatchFeatureVectors(recipeIds);
    console.log(`Successfully generated vectors for ${vectorMap.size} recipes`);

    // STEP 3: Process ALL similarities in a single batch operation
    await batchProcessRecipeSimilarities(recipeIds, maxSimilarities);

    console.log(`Successfully completed batch processing for ${recipeIds.length} recipes`);
  } catch (error) {
    console.error('Error during batch processing:', error);
  }
}