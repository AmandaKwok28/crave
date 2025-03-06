import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

/**
 * Generate and store a feature vector for a recipe
 */
export async function generateFeatureVector(recipeId: number): Promise<number[]> {
  try {
    // Get the recipe data
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: {
        title: true,
        ingredients: true,
        instructions: true,
        description: true
      }
    });

    if (!recipe) {
      throw new Error(`Recipe with ID ${recipeId} not found`);
    }

    // Call your Python script to generate the feature vector
    // This assumes your Python script is set up to accept JSON input and output
    const recipeData = JSON.stringify(recipe);
    const scriptPath = path.join(__dirname, '../../scripts/generate_vector.py');
    const { stdout } = await execAsync(`python3 ${scriptPath} '${recipeData}'`);
    
    // Parse the vector from the Python script output
    const vector = JSON.parse(stdout.trim());

    // Store the vector in the database
    await prisma.recipeFeatureVector.upsert({
      where: { recipeId },
      update: { vector },
      create: { recipeId, vector }
    });

    return vector;
  } catch (error) {
    console.error('Error generating feature vector:', error);
    throw error;
  }
}