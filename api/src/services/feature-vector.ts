import { prisma } from '../../prisma/db.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import { stringify } from 'querystring';

const execAsync = promisify(exec);

export async function generateBatchFeatureVectors(recipeIds: number[]): Promise<Map<number, number[]>> {
  let tempFile = '';
  
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
        description: true,
        mealTypes: true,       // added these things
        difficulty: true,
        price: true,
        cuisine: true,
        allergens: true,
        sources: true,
        prepTime: true,
        likes: true,
        bookmarks: true
      }
    });

    if (recipes.length === 0) {
      throw new Error(`No recipes found with the provided IDs`);
    }
    
    // Remove 'const' to update the outer variable instead of creating a new one
    tempFile = path.join(os.tmpdir(), `recipes_${Date.now()}.json`);
    console.log(JSON.stringify(recipes))
    fs.writeFileSync(tempFile, JSON.stringify(recipes), 'utf8');
    console.log(`Wrote recipe data to temporary file: ${tempFile}`);
    
    // Define __dirname for ES module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const scriptPath = path.join(__dirname, '../../scripts/generate_vector.py');
    const quotedScriptPath = `"${scriptPath}"`; // Wrap in quotes for paths with spaces
    const quotedTempFile = `"${tempFile}"`;
    
    // Run the Python script with the batch of recipes
    const { stdout, stderr } = await execAsync(`python ${quotedScriptPath} ${quotedTempFile}`);
    
    if (stderr) {
      console.log('Python:', stderr);
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
  } finally {
    // Clean up the temporary file
    if (tempFile) {
      try {
        fs.unlinkSync(tempFile);
        console.log(`Cleaned up temporary file: ${tempFile}`);
      } catch (cleanupErr) {
        console.warn(`Could not delete temporary file ${tempFile}:`, cleanupErr);
      }
    }
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