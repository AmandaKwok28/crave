import { test, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';

// mock the Prisma client
vi.mock('../../prisma/db', async () => {
    const actual = await vi.importActual<typeof import('../lib/__mocks__/prisma.js')>('../lib/__mocks__/prisma.js');
    return {
      ...actual
    };
});

const message = {
    ingredients: ["Ingredient1", "Ingredient2", "Ingredient3", "Ingredient4", "Ingredient5", "Ingredient6", "Ingredient7", "Ingredient8", "Ingredient9", "Ingredient10"],
    price: "$$",
    cuisine: "ITALIAN",
    difficulty: "EASY",
    prepTime: 30,
    tags: ["mock", "test", "fake", "unit-test", "sample"],
    mealTypes: ["Dinner"]
}

// Mock fetch for OpenAI API
vi.stubGlobal('fetch', vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        choices: [
          {
            message: {
              content: JSON.stringify(message)
            }
          }
        ]
      })
    })
));
  
// pdf-parse has one route and it's a post route
test('Testing that the gpt route is properly parsed for form fields', async () => {
const response = await request(app)
    .post('/gpt')
    .send({ 
        title: 'Pasta',
        description: 'test description',
        instructions: ['instruction1']
    });

expect(response.status).toBe(200);
expect(response.body.response).toEqual(message); 
});