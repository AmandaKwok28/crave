import { test, expect, vi, describe, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import { hashPassword } from '../lib/password';
import {prisma} from '../lib/__mocks__/prisma';

vi.mock('../../prisma/db', async () => {
  const actual = await vi.importActual<typeof import('../lib/__mocks__/prisma')>('../lib/__mocks__/prisma');
  return {
    ...actual
  };
});

const exampleUser1 = {
    id: '1abc',
    name: 'Example User 1',
    email: 'example1@example.com',
    school: 'Example University',
    major: 'Example Major',
    likes: [],
    bookmarks: []
};

const exampleUser2 = {
    id: '2def',
    name: 'Example User 2',
    email: 'example2@example.com',
    school: 'Example University',
    major: 'Example Major',
    likes: [],
    bookmarks: []
};

const exampleRecipe1 = {
    id: 1,
    published: true,
    title: 'Example Recipe 1',
    description: 'Description',
    ingredients: [ '' ],
    instructions: [ '' ],
    image: 'Image',
    authorId: '1abc',
    createdAt: new Date(),
    updatedAt: new Date(),
    viewCount: 0
};

const exampleRecipe2 = {
    id: 2,
    published: true,
    title: 'Example Recipe 2',
    description: 'Description',
    ingredients: [ '' ],
    instructions: [ '' ],
    image: 'Image',
    authorId: '1abc',
    createdAt: new Date(),
    updatedAt: new Date(),
    viewCount: 0
};

const exampleRecipe3 = {
    id: 3,
    published: true,
    title: 'Example Recipe 3',
    description: 'Description',
    ingredients: [ '' ],
    instructions: [ '' ],
    image: 'Image',
    authorId: '2def',
    createdAt: new Date(),
    updatedAt: new Date(),
    viewCount: 0
};

test('Recipe creation', async () => {
  prisma.recipe.create.mockResolvedValue({
    ...exampleRecipe1
  });

  const response = await request(app)
    .post('/recipe/')
    .send({
      title: exampleRecipe1.title,
      description: exampleRecipe1.description,
      ingredients: exampleRecipe1.ingredients,
      instructions: exampleRecipe1.instructions,
      authorId: exampleRecipe1.authorId,
      image: exampleRecipe1.image
    });

  expect(response.body).toStrictEqual({
    ...exampleRecipe1,
    createdAt: exampleRecipe1.createdAt.toISOString(),
    updatedAt: exampleRecipe1.createdAt.toISOString()
  });

  expect(response.status).toBe(200);
});