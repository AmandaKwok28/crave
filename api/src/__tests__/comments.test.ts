import { test, expect, vi, describe, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { prisma } from '../lib/__mocks__/prisma.js';

// mock the Prisma client
vi.mock('../../prisma/db', async () => {
    const actual = await vi.importActual<typeof import('../lib/__mocks__/prisma.js')>('../lib/__mocks__/prisma.js');
    return {
      ...actual
    };
});

const mock_date = new Date('2023-08-15');
const exampleComments = [
    {id: 1, createdAt: mock_date, content: 'example comment', recipeId: 1, 'authorId': 'user-1'},
    {id: 2, createdAt: mock_date, content: 'example comment', recipeId: 1, 'authorId': 'user-1'},
    {id: 3, createdAt: mock_date, content: 'example comment', recipeId: 1, 'authorId': 'user-1'}
];
const mock_recipeId = 1;

describe('Test for all the comments routes', () => {

    // get
    test('Test the comments get route', async () => {
        // mock a response from the comments route
        prisma.comment.findMany.mockResolvedValue([
            ...exampleComments,
        ]);

        const response = await request(app)
            .get(`/recipe/${mock_recipeId}/comments`);
        
        expect(response.status).toBe(200);
    })
    // post
    // delete
})