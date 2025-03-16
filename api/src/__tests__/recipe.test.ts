import { test, expect, vi, describe, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import { prisma } from '../lib/__mocks__/prisma';

vi.mock('../../prisma/db', async () => {
  return {
    ...await vi.importActual<typeof import('../lib/__mocks__/prisma')>('../lib/__mocks__/prisma')
  };
});
const exampleRecipe = {
  id: 1,
  published: true,
  title: 'Example Recipe',
  description: 'Description',
  ingredients: [ '' ],
  instructions: [ '' ],
  image: 'Image',
  authorId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  viewCount: 0,
  mealTypes: ["snack"],
  price: null,
  cuisine: null,
  allergens: ["peanuts"],
  difficulty: null,
  prepTime: 10,
  sources: ["Charmar"]
};

test('Recipe creation', async () => {
  prisma.recipe.create.mockResolvedValue({
    ...exampleRecipe,
  });

  const response = await request(app)
    .post('/recipe/')
    .send({
      title: exampleRecipe.title,
      description: exampleRecipe.description,
      ingredients: exampleRecipe.ingredients,
      instructions: exampleRecipe.instructions,
      authorId: exampleRecipe.authorId,
      image: exampleRecipe.image
    });

  expect(response.body).toStrictEqual({
    ...exampleRecipe,
    createdAt: exampleRecipe.createdAt.toISOString(),
    updatedAt: exampleRecipe.createdAt.toISOString()
  });

  expect(response.status).toBe(200);
});
