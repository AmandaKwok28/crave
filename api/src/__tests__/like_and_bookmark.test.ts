import { test, expect, vi, describe, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import { hashPassword } from '../lib/password';
import {prisma} from '../lib/__mocks__/prisma';

vi.mock('../../prisma/db', async () => {
  return {
    ...await vi.importActual<typeof import('../lib/__mocks__/prisma')>('../lib/__mocks__/prisma')
  };
});

const exampleLike1 = {
    id: 1,
    recipeId: 1,
    userId: '1abc',
    date: new Date(),
};


const exampleUser1 = {
    id: '1abc',
    name: 'Example User 1',
    email: 'example1@example.com',
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
    likes: [],
    bookmarks: [],
    image: 'Image',
    authorId: '1abc',
    createdAt: new Date(),
    updatedAt: new Date(),
    viewCount: 0
};

const exampleLike2 = {
    id: 2,
    recipeId: 2,
    userId: '2def',
    date: new Date(),
};

const exampleUser2 = {
    id: '2def',
    name: 'Example User 2',
    email: 'example2@example.com',
    school: 'Example University',
    major: 'Example Major',
    likes: [exampleLike2],
    bookmarks: []
};


const exampleRecipe2 = {
    id: 2,
    published: true,
    title: 'Example Recipe 2',
    description: 'Description',
    ingredients: [ '' ],
    instructions: [ '' ],
    image: 'Image',
    likes: [exampleLike2],
    bookmarks: [],
    authorId: '1abc',
    createdAt: new Date(),
    updatedAt: new Date(),
    viewCount: 0
};

describe('Create and delete like tests', () => {
    beforeEach(async () => {
        // adding user for testing
        prisma.user.create.mockResolvedValue({
        ...exampleUser1,
        passwordHash: await hashPassword('password')
        });

        // adding recipe for testing
        prisma.recipe.create.mockResolvedValue({
            ...exampleRecipe1,
        });

        // adding like for testing
        prisma.like.create.mockResolvedValue({
            ...exampleLike1
        }); 
    });

    test('Adding a like to a recipe for a user', async () => {
        prisma.session.findUnique.mockResolvedValue({
              id: '01',
              userId: '1abc',
              expiresAt: new Date(Date.now() + 1_000_000),
              //@ts-ignore
              user: {
                ...exampleUser1,
                passwordHash: 'password'
              }
        });

        const response = await request(app)
            .post('/like/1')
            .set('Cookie', [
                'session=01'
            ])
            .send({
            recipeId: exampleLike1.recipeId
        });
        
        expect(response.body).toStrictEqual({
            success: true
        });

        expect(response.status).toBe(200);
    });   

    test('Removing a like from a recipe for a user', async () => {
        prisma.session.findUnique.mockResolvedValue({
              id: '01',
              userId: '1abc',
              expiresAt: new Date(Date.now() + 1_000_000),
              //@ts-ignore
              user: {
                ...exampleUser1,
                passwordHash: 'password'
              }
        });

        const response = await request(app)
            .delete('/like/1')
            .set('Cookie', [
                'session=01'
            ])
            .send({
            recipeId: exampleLike1.recipeId
        });
        
        expect(response.body).toStrictEqual({
            success: true
        });

        expect(response.status).toBe(200);
    });
 
});

describe('fetch like tests for current user and recipes', () => {
    beforeEach(async () => {
        // adding user for testing
        prisma.user.create.mockResolvedValue({
        ...exampleUser2,
        passwordHash: await hashPassword('password')
        });
        
        // adding recipe for testing
        prisma.recipe.create.mockResolvedValue({
            ...exampleRecipe2,
        });
        // adding recipe for testing
        prisma.recipe.create.mockResolvedValue({
            ...exampleRecipe1,
        });

        // adding like for testing
        prisma.like.create.mockResolvedValue({
            ...exampleLike2
        }); 
    }); 

    // test('Checking get all likes for a given user', async () => {
    //     const response = await request(app)
    //         .get('/like/user/1abc')
    //         .send({
    //         userId: exampleLike1.userId
    //     });
        
    //     expect(response.body).toStrictEqual({
    //         likes: [exampleLike1]
    //     });

    //     expect(response.status).toBe(200);
    // });  
    
    // test('Checking if a user has liked a specific recipe when they have', async () => {
    //     prisma.session.findUnique.mockResolvedValue({
    //             id: '02',
    //             userId: '2def',
    //             expiresAt: new Date(Date.now() + 1_000_000),
    //             //@ts-ignore
    //             user: {
    //             ...exampleUser2,
    //             passwordHash: 'password'
    //             }
    //     });

    //     const response = await request(app)
    //         .get('/like/recipe/2')
    //         .set('Cookie', [
    //             'session=02'
    //         ])
    //         .send({
    //         recipeId: exampleLike2.recipeId
    //     });
        
    //     expect(response.body).toStrictEqual({
    //         liked: true
    //     });

    // });  

    test('Checking if a user has liked a specific recipe when they have not', async () => {
        prisma.session.findUnique.mockResolvedValue({
              id: '02',
              userId: '2def',
              expiresAt: new Date(Date.now() + 1_000_000),
              //@ts-ignore
              user: {
                ...exampleUser2,
                passwordHash: 'password'
              }
        });

        const response = await request(app)
            .get('/like/recipe/1')
            .set('Cookie', [
                'session=02'
            ])
            .send({
            recipeId: exampleRecipe1.id
        });
        
        expect(response.body).toStrictEqual({
            liked: false
        });

        expect(response.status).toBe(200);
    });  

});