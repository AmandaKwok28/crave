import { prisma } from '../../prisma/db.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function generateBatchFeatureVectors(recipeIds: number[]): Promise<Map<number, number[]>> {
  try {
    // Fetch all recipes in one database query
    const recipes = await prisma.recipe.findMany({
      where: { 
        id: { in: recipeIds } 
      },
      select: {
        id: true,
        title: true,
        ingredients: true,
        instructions: true,
        description: true
      }
    });

    if (recipes.length === 0) {
      throw new Error(`No recipes found with the provided IDs`);
    }

    // Build a map of id -> recipe for later reference
    const recipeMap = new Map(recipes.map(r => [r.id, r]));
    
    // Create batch payload
    const batchData = JSON.stringify(recipes);
    const scriptPath = path.join(__dirname, '../../scripts/generate_vector.py');
    
    // Run the Python script with the batch of recipes
    const { stdout, stderr } = await execAsync(`python3 ${scriptPath} '${batchData}'`);
    
    if (stderr) {
      console.log('Python stderr:', stderr);
    }

    // Parse the result - expects format { recipeId: vector, ... }
    const vectorResults = JSON.parse(stdout.trim());
    const resultMap = new Map<number, number[]>();

    // Process the results and store in database
    const upsertPromises = Object.entries(vectorResults).map(async ([idStr, vector]) => {
      const recipeId = parseInt(idStr);
      resultMap.set(recipeId, vector as number[]);
      
      // Store in database
      return prisma.recipeFeatureVector.upsert({
        where: { recipeId },
        update: { vector: vector as number[] },
        create: { recipeId, vector: vector as number[] }
      });
    });
    // Execute all database updates in parallel
    await Promise.all(upsertPromises);
    
    return resultMap;
  } catch (error) {
    console.error('Error generating batch feature vectors:', error);
    throw error;
  }
}

export async function generateFeatureVector(recipeId: number): Promise<number[]> {
  const resultMap = await generateBatchFeatureVectors([recipeId]);
  const vector = resultMap.get(recipeId);
  if (!vector) {
    throw new Error(`Failed to generate vector for recipe ${recipeId}`);
  }
  return vector;
}