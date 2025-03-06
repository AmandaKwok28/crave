import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Calculate and store similarity between two recipes in both directions
 */
export async function storeBidirectionalSimilarity(recipe1Id: number, recipe2Id: number) {
  // Calculate similarity score once
  const recipe1 = await prisma.recipe.findUnique({ where: { id: recipe1Id } });
  const recipe2 = await prisma.recipe.findUnique({ where: { id: recipe2Id } });
  
  if (!recipe1 || !recipe2) {
    throw new Error(`One or both recipes not found: ${recipe1Id}, ${recipe2Id}`);
  }
  
  const similarityScore = calculateSimilarity(recipe1, recipe2);
  
  // Store both directions in a transaction
  await prisma.$transaction([
    // Direction 1: recipe1 -> recipe2
    prisma.recipeSimilarity.upsert({
      where: {
        baseRecipeId_similarRecipeId: {
          baseRecipeId: recipe1Id,
          similarRecipeId: recipe2Id
        }
      },
      update: { similarityScore },
      create: {
        baseRecipeId: recipe1Id,
        similarRecipeId: recipe2Id,
        similarityScore
      }
    }),
    
    // Direction 2: recipe2 -> recipe1 (same score)
    prisma.recipeSimilarity.upsert({
      where: {
        baseRecipeId_similarRecipeId: {
          baseRecipeId: recipe2Id,
          similarRecipeId: recipe1Id
        }
      },
      update: { similarityScore },
      create: {
        baseRecipeId: recipe2Id,
        similarRecipeId: recipe1Id,
        similarityScore
      }
    })
  ]);
}

/**
 * Calculate similarity between two recipes
 */
function calculateSimilarity(recipe1: any, recipe2: any): number {
  // Implement your cosine similarity algorithm here
  // For example:
  
  // 1. Convert ingredients to sets for comparison
  const ingredients1 = new Set(recipe1.ingredients.map((i: string) => i.toLowerCase()));
  const ingredients2 = new Set(recipe2.ingredients.map((i: string) => i.toLowerCase()));
  
  // 2. Find common ingredients (intersection)
  const commonIngredients = Array.from(ingredients1).filter(i => ingredients2.has(i));  

  // 3. Calculate Jaccard similarity coefficient
  const similarity = commonIngredients.length / 
    (ingredients1.size + ingredients2.size - commonIngredients.length);
    
  // Return value between 0-1
  return similarity;
}

/**
 * Process a new or updated recipe to calculate its similarities
 */
export async function processRecipeSimilarities(recipeId: number) {
  // Get all other published recipes
  const otherRecipes = await prisma.recipe.findMany({
    where: { 
      id: { not: recipeId },
      published: true
    }
  });
  
  // Calculate and store bidirectional similarities
  for (const recipe of otherRecipes) {
    await storeBidirectionalSimilarity(recipeId, recipe.id);
  }
}