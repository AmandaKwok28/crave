import { test, expect, vi, type Mock } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { beforeEach, describe } from 'node:test';
import { Like } from '@prisma/client';
import { prisma } from '../../prisma/db.js';
import messageRoutes from '../routes/message.routes.js'

const exampleLikes: Like[] = [{
    id: 1,
    recipeId: 1,
    userId: '1abc',
    date: new Date(),
  }];
  
  const exampleUser1 = {
      id: '1abc',
      name: 'Example User 1',
      email: 'example1@example.com',
      school: 'Example University',
      major: 'Example Major',
      likes: exampleLikes,
      bookmarks: [],
      avatarImage: '',
      rating: 0
  };
  
  const exampleUser2 = {
    id: '2def',
    name: 'Example User 1',
    email: 'example1@example.com',
    school: 'Example University',
    major: 'Example Major',
    likes: exampleLikes,
    bookmarks: [],
    avatarImage: '',
    rating: 0
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
    likes: exampleLikes,
    bookmarks: [],
    mealTypes: ["snack"],
    price: null,
    cuisine: null,
    allergens: ["peanuts"],
    difficulty: null,
    prepTime: 10,
    sources: ["Charmar"]
  };

// mock the authguard
vi.mock('../middleware/auth.ts', async () => {
  const actual = await vi.importActual<typeof import('../middleware/auth.ts')>('../middleware/auth.ts');
  return {
    ...actual,
    authGuard: (_, res, next) => {
      res.locals.user = { id: exampleUser1.id };
      res.locals.session = { id: 'mock-session' };
      next();
    }
  };
});

// mock the session for session = 01
vi.mock('../lib/session.js', () => ({
  validateSessionToken: vi.fn((token: string) => {
    if (token === '01') {
      return Promise.resolve({
        session: { id: 'session123', userId: '1abc' },
        user: exampleUser1
      });
    }

    return Promise.resolve({ session: null, user: null });
  }),
  deleteSessionTokenCookie: vi.fn()
}));


vi.mock('../../prisma/db.js', () => ({
    prisma: {
        conversation: {
            findMany: vi.fn().mockImplementation(() => {
                return Promise.resolve([]);
            }),
            findFirst: vi.fn().mockImplementation(() => {
                return Promise.resolve([]);
            })
        }
    }
}));

describe('testing all messages routes', () => {
    beforeEach(() => {
        app.use('/message', messageRoutes);
    })
    test('testing get messages', async () => {
        const req = await request(app)
            .get('/message')
            .set('Cookie', ['session=01'])  

        expect(req.status).toBe(200);
    })

    test('get message server error', async () => {
        (prisma.conversation.findMany as unknown as Mock).mockImplementationOnce(() => {
            throw new Error('Internal server error');
        });
        const req = await request(app)
            .get('/message')
            .set('Cookie', ['session=01'])  

        expect(req.status).toBe(500);
    })

    // test('get specific messages in a convo', async () => {
    //     const req = await request(app)
    //         .get(`/message/${1}/messages`)
    //         .set('Cookie', ['session=01'])  
    //         .query({
    //             page: 1,
    //             limit: 5
    //         })
    //     expect(req.status).toBe(500);
    // })
})
