import { prisma } from '../../prisma/db';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

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

    const recipeData = JSON.stringify(recipe);
    const scriptPath = path.join(__dirname, '../../scripts/generate_vector.py');
    
    const { stdout: pythonPath } = await execAsync('which python3'); // testing
    console.log('Python interpreter path:', pythonPath.trim());

    const { stdout, stderr } = await execAsync(`python3 ${scriptPath} '${recipeData}'`);
    
    if (stderr) {
      console.log(stderr);
    }

    // Parse the vector from the Python script output
    const vector = JSON.parse(stdout.trim());

    // Store the vector in the database
    await prisma.recipeFeatureVector.upsert({
      where: { recipeId },
      update: { vector },
      create: { recipeId, vector }
    });
    console.log('vector generated:', vector);
    return vector;
  } catch (error) {
    console.error('Error generating feature vector:', error);
    throw error;
  }
}