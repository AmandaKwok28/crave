import { defineConfig } from "cypress";
import dotenvPlugin from 'cypress-dotenv';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      return dotenvPlugin(config, null, true);
    }
  },
});
