import cron from 'node-cron';
import { processUnvectorizedRecipes, recommendedRecipes } from './background-vector-update.js';

export function startBackgroundJobs() {
  // Run every 10 min to check for unvectorized recipes
  cron.schedule('*/1 * * * *', async () => {
    try {
      await processUnvectorizedRecipes(50, 10); // 50 recipes at a time, 10 similarities kept for each recipe
      await recommendedRecipes();         // 10 at a time, 10 recommended for now (calculate 10 at a time, delete oldest 10)
    } catch (error) {
      console.error('Error in scheduled vector generation:', error);
    }
  });
  
  console.log('Background jobs scheduled');
}