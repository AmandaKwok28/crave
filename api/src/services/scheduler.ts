import cron from 'node-cron';
import { processUnvectorizedRecipes } from './background-vector-update';

export function startBackgroundJobs() {
  // Run every 5 min to check for unvectorized recipes
  cron.schedule('*/5 * * * *', async () => {
    try {
      await processUnvectorizedRecipes(50, 10); // 50 recipes at a time, 10 similarities kept for each recipe
    } catch (error) {
      console.error('Error in scheduled vector generation:', error);
    }
  });
  
  console.log('Background jobs scheduled');
}