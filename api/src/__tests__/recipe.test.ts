import { test, expect, vi, describe, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import { prisma } from '../lib/__mocks__/prisma';
import { Like } from '@prisma/client';

vi.mock('../../prisma/db', async () => {
  return {
    ...await vi.importActual<typeof import('../lib/__mocks__/prisma')>('../lib/__mocks__/prisma')
  };
});

const exampleLike: Like = {
  id: 1,
  recipeId: 1,
  userId: '1abc',
  date: new Date(),
};

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
  likes: [exampleLike],
  bookmarks: [],
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
    createdAt: exampleRecipe.createdAt,
    updatedAt: exampleRecipe.createdAt
  });

  expect(response.status).toBe(200);
});

test('get recipe', async () => {
  prisma.recipe.findUnique.mockResolvedValue({
    ...exampleRecipe,
  });

  const response = await request(app)
    .get('/recipe/1')

  expect(response.body).contains({
    id: 1,
    published: true,
    title: 'Example Recipe',
    description: 'Description',
    ingredients: [ '' ],
    instructions: [ '' ],
    image: 'Image',
    authorId: '1',
  });

  expect(response.status).toBe(200);
});

