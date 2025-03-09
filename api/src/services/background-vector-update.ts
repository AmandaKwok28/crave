import { prisma } from '../../prisma/db';
import { generateFeatureVector } from './feature-vector';
import { processRecipeSimilarities } from './recipe-similarity';

export async function processUnvectorizedRecipes(batchSize = 10, maxSimilarities = 10) {
  console.log('Starting vector generation for recipes without vectors');
  
  const recipes = await prisma.recipe.findMany({
    where: {
      published: true,
      featureVector: null
    },
    take: batchSize, // Process in small batches to avoid overloading
    orderBy: { viewCount: 'desc' }, // Prioritize popular recipes
  });
  
  if (recipes.length === 0) {
    console.log('No recipes found without feature vectors');
    return;
  }
  
  console.log(`Processing ${recipes.length} recipes without feature vectors`);
  
  for (const recipe of recipes) {
    try {
      await generateFeatureVector(recipe.id);
      
      // Update similarities with other recipes
      await processRecipeSimilarities(recipe.id, maxSimilarities);
      
      console.log(`Successfully processed recipe ${recipe.id}`);
    } catch (error) {
      console.error(`Error processing recipe ${recipe.id}:`, error);
      // Continue with other recipes even if one fails
    }
  }
  
  console.log('Finished vector generation batch');
}