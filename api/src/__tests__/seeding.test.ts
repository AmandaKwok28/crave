import dotenvFlow from 'dotenv-flow';

// automatically loads .env.test if NODE_ENV=test, check the env when running
dotenvFlow.config();
console.log("[DB] Environment:", process.env.NODE_ENV);

import { 
    test,  
    describe, 
    expect,
} from 'vitest';

import testRecipesTextData from '../seed_helpers/generate_recipe_data.js';
import generateRecipes from '../seed_helpers/recipe_gpt_data.js';



describe('testing the seeding scripts', async () =>{
    test('generate recipe data test', async () => {
        for (let i = 0; i < testRecipesTextData.length; i++) {
            expect(testRecipesTextData[i].title).not.toBeNull();
            expect(testRecipesTextData[i].description).not.toBeNull();
            expect(testRecipesTextData[i].ingredients).not.toBeNull();
            expect(testRecipesTextData[i].instructions).not.toBeNull();
        } 
    })

    test('generate recipe data from gpt', async () => {
        const testRecipesTextData = await generateRecipes(2);
        console.log(process.env.OPENAI_API_KEY)
        for (const recipeData of testRecipesTextData) {
            expect(recipeData.title).not.toBeNull();
            expect(recipeData.description).not.toBeNull();
            expect(recipeData.ingredients).not.toBeNull();
            expect(recipeData.instructions).not.toBeNull();
            expect(recipeData.mealTypes).not.toBeNull();
            expect(recipeData.price).not.toBeNull();
            expect(recipeData.cuisine).not.toBeNull();
            expect(recipeData.allergens).not.toBeNull();
            expect(recipeData.difficulty).not.toBeNull();
            expect(recipeData.sources).not.toBeNull();
            expect(recipeData.prepTime).not.toBeNull();
        }
    }, 50000) // gpt call takes a hot minute tbh
})