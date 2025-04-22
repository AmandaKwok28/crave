import { prisma } from '../../prisma/db.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);

export async function generatePartyVector(partyId: string[]): Promise<number[]> {
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
      throw new Error(`No party found with the provided ID`);
    }
    
    tempFile = path.join(os.tmpdir(), `party_preferences_${Date.now()}.json`);
    fs.writeFileSync(tempFile, JSON.stringify(party?.preferences), 'utf8');
    console.log(`Wrote party preferences to temporary file: ${tempFile}`);
    
    // Define __dirname for ES module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const scriptPath = path.join(__dirname, '../../scripts/generate_party_vector.py');
    const quotedScriptPath = `"${scriptPath}"`; // Wrap in quotes for paths with spaces
    const quotedTempFile = `"${tempFile}"`;
    
    // Run the Python script with the party preferences
    const { stdout, stderr } = await execAsync(`python ${quotedScriptPath} ${quotedTempFile}`);
    
    if (stderr) {
      console.log('Python:', stderr);
    }

    // Parse the result - expects format { party_vector: [...] }
    const vectorResults = JSON.parse(stdout.trim());
    return vectorResults.party_vector;
  } catch (error) {
    console.error('Error generating party feature vector:', error);
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
  return await generatePartyVector([partyId]);
}