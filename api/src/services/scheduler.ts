import cron from 'node-cron';
import { processUnvectorizedRecipes } from './background-vector-update';

export function startBackgroundJobs() {
  // Run every hour to check for unvectorized recipes
  cron.schedule('0 * * * *', async () => {
    try {
      await processUnvectorizedRecipes(10); // 20 recipes at a time
    } catch (error) {
      console.error('Error in scheduled vector generation:', error);
    }
  });
  
  console.log('Background jobs scheduled');
}