import { test, expect, vi, describe, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { prisma } from '../lib/__mocks__/prisma.js';
import { Bookmark, Like } from '@prisma/client';
import { hashPassword } from '../lib/password.js';

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

const stringifiedComments = exampleComments.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
}));



const mock_authorId = '1abc';
const mock_content = 'This is a test comment';
const exampleLike: Like = {
    id: 1,
    recipeId: 1,
    userId: '1abc',
    date: new Date(),
};

const recipe =  {
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

const exampleBookmark1: Bookmark = {
    id: 1,
    recipeId: 2,
    userId: '2def',
};

const exampleUser1 = {
    id: '1abc',
    name: 'Example User 1',
    email: 'example1@example.com',
    school: 'Example University',
    major: 'Example Major',
    likes: exampleLike,
    bookmarks: exampleBookmark1,
    avatarImage: '',
    rating: 0,
    passwordHash: 'fake'
};

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
        expect(response.body).toEqual(stringifiedComments);
    })

    // post
    test('Test the create comments route', async () => {

        prisma.comment.create.mockResolvedValue(exampleComments[1]);
        prisma.recipe.findUnique.mockResolvedValue(recipe);
        prisma.user.findUnique.mockResolvedValue(exampleUser1);
        const response = await request(app)
            .post(`/recipe/${mock_recipeId}/comments`)
            .send({
                content: mock_content,
                id: mock_recipeId,     // matches your body-based lookup
                authorId: mock_authorId
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toEqual("Comment created successfully");
        expect(response.body.comment).toEqual(stringifiedComments[1]);
    })

    // delete
    test('Test the delete comments route', async () => {

        const mockComment = {
            ...exampleComments[1],
            recipe: {
                id: recipe.id,  // Make sure this matches the recipe ID you're testing with
            },
            user: exampleUser1
        };
    
        // set up all the mocks
        const mockUser = {
            ...exampleUser1,
            passwordHash: await hashPassword('password')
        };
    
        const mockSession = {
            id: 'session-01',
            userId: exampleUser1.id,
            expiresAt: new Date(Date.now() + 1_000_000),
            user: mockUser
        };
    
        // mock user operations
        prisma.user.findUnique.mockResolvedValue(mockUser);
        prisma.user.create.mockResolvedValue(mockUser);
        
        // mock the session
        prisma.session.findUnique.mockResolvedValue(mockSession);
        prisma.session.create.mockResolvedValue(mockSession);
        
        // mock the recipe and comment operations
        prisma.recipe.findUnique.mockResolvedValue(recipe);
        prisma.comment.findUnique.mockResolvedValue(mockComment); // Use the complete mock comment
        prisma.comment.delete.mockResolvedValue(mockComment);
    
        // register the user (for the authGuard)
        const registerResponse = await request(app)
            .post('/register')
            .send({
                ...exampleUser1,
                password: 'password'
            });
    
        const cookie = registerResponse.headers['set-cookie'];
        expect(cookie).toBeDefined();
    
        const deleteResponse = await request(app)
            .delete(`/recipe/${recipe.id}/comments/${exampleComments[1].id}`)
            .set('Cookie', cookie);
        
        expect(deleteResponse.status).toBe(200);
        expect(prisma.comment.delete).toHaveBeenCalledWith({
            where: { id: exampleComments[1].id }
        });
    });
       
})