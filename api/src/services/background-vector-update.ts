import { prisma } from '../../prisma/db.js';
import { generateBatchFeatureVectors } from './feature-vector.js';
import { batchProcessRecipeSimilarities, calculateCosineSimilarity } from './recipe-similarity.js';

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

// get the user also...
export async function recommendedRecipes(batchSize=5, maxSimilarities=10) {

  try {

    // get all the users and find recommended for each user
    console.log('Fetching users to create recommendations')
    const users = await prisma.user.findMany();     
    for (const user of users) {

      // get the recently viewed up to the most recent n (determined by batchsize)
      console.log('Fetching recently viewed recipes')
      const recentlyViewed = await prisma.recentlyViewed.findMany({   
        where: { userId: user.id },
        orderBy: { viewedAt: "desc" },
        take: batchSize,
        select: { recipeId: true }, // ⬅️ Make sure you're selecting the actual recipeId
      });

      if (recentlyViewed.length === 0) continue;
      console.log('Recently viewed recipes fetched!')

      // get the average feature vector
      console.log('Creating average feature vector')
      const recipeIds = recentlyViewed.map(recipe => recipe.recipeId);
      const featureVectors = await prisma.recipeFeatureVector.findMany({              
        where: { recipeId: { in: recipeIds } }
      });

      if (featureVectors.length === 0) { // find a more elegant way to deal with this later
        console.log('Failed to get feature vectors for recently viewed recipes') 
        continue;
      }           

      console.log('Creating average feature vector');
      const vectorSize = featureVectors[0].vector.length;
      const averagedVector = new Array(vectorSize).fill(0);
      for (const { vector } of featureVectors) {
        for (let i = 0; i < vectorSize; i++) {
          averagedVector[i] += vector[i] / featureVectors.length;
        }
      }

      // get all published recipes with vectors (excluding the viewed ones because their similarity would be biased)
      const otherRecipes = await prisma.recipeFeatureVector.findMany({
        where: { recipeId: { notIn: recipeIds } },
        select: { recipeId: true, vector: true },
      });

      // calculate similarity between the averaged vector and all other recipes
      const similarityScores = otherRecipes
        .map(({ recipeId, vector }) => ({
          recipeId,
          similarity: calculateCosineSimilarity(averagedVector, vector),
        }))
        .filter(({ similarity }) => !isNaN(similarity)); // Only valid scores


      // sort by similarity and return the top recommended recipes
      similarityScores.sort((a, b) => b.similarity - a.similarity);
      const topRecommended = similarityScores.slice(0, maxSimilarities);
      console.log(topRecommended)


      // get current recommendations
      const existingRecs = await prisma.recommendedRecipe.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' },
      });

      // remove the oldest recommendations to make room
      if (existingRecs.length + topRecommended.length > 10) {
        const overflow = existingRecs.length + topRecommended.length - 10;
        const idsToRemove = existingRecs.slice(0, overflow).map(rec => rec.recipeId);

        await prisma.recommendedRecipe.deleteMany({
          where: {
            userId: user.id,
            recipeId: { in: idsToRemove }
          }
        });
      }

      // Add the new recommended recipes
      await prisma.recommendedRecipe.createMany({
        data: topRecommended.map(rec => ({
          userId: user.id,
          recipeId: rec.recipeId,
          similarityScore: rec.similarity,
        }))
      });

      console.log('Finsihed generating recommended recipes!')

    }

  } catch (error) {
    console.log('Error using history to generate recommended recipes')
  }

}