import cron from 'node-cron';
import { processUnvectorizedRecipes } from './background-vector-update';

export function startBackgroundJobs() {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    try {
      await processUnvectorizedRecipes(20); // 20 recipes at a time
    } catch (error) {
      console.error('Error in scheduled vector generation:', error);
    }
  });
  
  console.log('Background jobs scheduled');
}