import dotenvFlow from 'dotenv-flow';
import { 
    test,  
    describe, 
    expect,
    afterEach,
    beforeEach,
    beforeAll,
    afterAll,
} from 'vitest';
import testRecipesTextData from '../seed_helpers/generate_recipe_data.js';
import generateRecipes from '../seed_helpers/recipe_gpt_data.js';
import { prisma } from '../../prisma/db.js';
import { main } from '../../prisma/seed.js';
import { main2 } from '../../prisma/seed_liam.js';

// automatically loads .env.test if NODE_ENV=test, check the env when running
dotenvFlow.config();
console.log("[DB] Environment:", process.env.NODE_ENV);


// make sure to clear the database after each run 


describe('testing the seeding scripts', async () =>{
    // can't figure out how to not cause the other tests to immediately fail
    // test('test the other seeding script by liam', async () => {       
    //     const res = await main2();
    //     expect(res).toEqual(true);
    // }, 100000)

    // test('placeholder', () => {
    //     expect(200).toEqual(200);
    // })

    test('generate recipe data test', async () => {
        for (let i = 0; i < testRecipesTextData.length; i++) {
            expect(testRecipesTextData[i].title).not.toBeNull();
            expect(testRecipesTextData[i].description).not.toBeNull();
            expect(testRecipesTextData[i].ingredients).not.toBeNull();
            expect(testRecipesTextData[i].instructions).not.toBeNull();
        } 
    })

    // test('generate recipe data from gpt', async () => {
    //     const testRecipesTextData = await generateRecipes(2);
    //     console.log(process.env.OPENAI_API_KEY)
    //     for (const recipeData of testRecipesTextData) {
    //         expect(recipeData.title).not.toBeNull();
    //         expect(recipeData.description).not.toBeNull();
    //         expect(recipeData.ingredients).not.toBeNull();
    //         expect(recipeData.instructions).not.toBeNull();
    //         expect(recipeData.mealTypes).not.toBeNull();
    //         expect(recipeData.price).not.toBeNull();
    //         expect(recipeData.cuisine).not.toBeNull();
    //         expect(recipeData.allergens).not.toBeNull();
    //         expect(recipeData.difficulty).not.toBeNull();
    //         expect(recipeData.sources).not.toBeNull();
    //         expect(recipeData.prepTime).not.toBeNull();
    //     }
    // }, 50000) // gpt call takes a hot minute tbh


    // test('test the seeding script', async () => {
    //     const res = await main(2)
    //     expect(res).toEqual(true);
    // }, 50000)
})