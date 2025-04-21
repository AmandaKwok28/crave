import { prisma } from '../../prisma/db.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import { stringify } from 'querystring';

const execAsync = promisify(exec);

export async function generatePartyVector(partyId: string[]): Promise<Map<string, number[]>> {
  let tempFile = '';
  
  try {
    // Fetch the party with partyId
    const party = await prisma.cookingParty.findUnique({
      where: { id: partyId[0] },
      include: {
        preferences: {
          select: {
            availableTime: true,
            preferredCuisines: true,
            preferredPrice: true,
            aggregatedIngredients: true,
            excludedAllergens: true,
            preferredDifficulty: true
          }
        }
      }
    });

    if (!party) {
      throw new Error(`No recipes found with the provided IDs`);
    }
    
    // Remove 'const' to update the outer variable instead of creating a new one
    tempFile = path.join(os.tmpdir(), `recipes_${Date.now()}.json`);
    console.log(JSON.stringify(party?.preferences))
    fs.writeFileSync(tempFile, JSON.stringify(party?.preferences), 'utf8');
    console.log(`Wrote recipe data to temporary file: ${tempFile}`);
    
    // Define __dirname for ES module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const scriptPath = path.join(__dirname, '../../scripts/generate_party_vector.py');
    const quotedScriptPath = `"${scriptPath}"`; // Wrap in quotes for paths with spaces
    const quotedTempFile = `"${tempFile}"`;
    
    // Run the Python script with the batch of recipes
    const { stdout, stderr } = await execAsync(`python ${quotedScriptPath} ${quotedTempFile}`);
    
    if (stderr) {
      console.log('Python:', stderr);
    }

    // Parse the result - expects format { recipeId: vector, ... }
    const vectorResults = JSON.parse(stdout.trim());
    const resultMap = new Map<string, number[]>();

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

export async function generateFeaturePartyVector(partyId: string): Promise<number[]> {
  const resultMap = await generatePartyVector([partyId]);
  const vector = resultMap.get(partyId);
  if (!vector) {
    throw new Error(`Failed to generate vector for recipe ${partyId}`);
  }
  return vector;
}