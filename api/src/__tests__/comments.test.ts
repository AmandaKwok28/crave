import { test, expect, vi, describe, type Mock, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { prisma } from '../../prisma/db.js';
import { Bookmark, Like } from '@prisma/client';
import comments_route from '../routes/comments.js';

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
       comment: {
            findMany: vi.fn().mockImplementation(() => {
                return Promise.resolve([]);
            }),
            findUnique: vi.fn().mockImplementation(() => {
                return Promise.resolve({
                    recipe: {
                        id: 1
                    }
                });
            }),
            create: vi.fn().mockImplementation(() => {
                return Promise.resolve({});
            }),
            delete: vi.fn().mockImplementation(() => {
                return Promise.resolve({});
            })
       },
       user: {
        findUnique: vi.fn().mockImplementation(() => {
            return Promise.resolve({
                id: 'authorid'
            });
        })
       },
       recipe: {
        findUnique: vi.fn().mockImplementation(() => {
            return Promise.resolve({});
        }),
       }
    }
}));
  


describe('Test for all the comments routes', () => {

    beforeAll(() => {
        app.use(comments_route);
    })

    // get
    test('Test the comments get route', async () => {
        const response = await request(app)
            .get(`/recipe/${1}/comments`);
        
        expect(response.status).toBe(200);
    })

    test('Test the comments get route fails', async () => {
        const response = await request(app)
            .get(`/recipe/${null}/comments`);
        
        expect(response.status).toBe(400);
    })


    test('create comment', async () => {
        const res = await request(app)
            .post(`/recipe/${1}/comments`)
            .set('Cookie', ['session=01'])  
            .send({
                content: 'hi',
                id: 1,
                authorId: '2'
            })
        expect(res.status).toBe(201);
    })

    test('create comment bad schema', async () => {
        const res = await request(app)
            .post(`/recipe/${1}/comments`)
            .set('Cookie', ['session=01'])  
            .send({
                content: 'hi',
                id: '1',
                authorId: '2'
            })
        expect(res.status).toBe(400);
    })

    test('create comment bad recipe', async () => {
        (prisma.recipe.findUnique as unknown as Mock).mockImplementationOnce(() => {
            return Promise.resolve(undefined);
        });
        const res = await request(app)
            .post(`/recipe/${1}/comments`)
            .set('Cookie', ['session=01'])  
            .send({
                content: 'hi',
                id: 1,
                authorId: '2'
            })
        expect(res.status).toBe(404);
    })

    test('create comment bad author', async () => {
        (prisma.user.findUnique as unknown as Mock).mockImplementationOnce(() => {
            return Promise.resolve(undefined);
        });
        const res = await request(app)
            .post(`/recipe/${1}/comments`)
            .set('Cookie', ['session=01'])  
            .send({
                content: 'hi',
                id: 1,
                authorId: '2'
            })
        expect(res.status).toBe(404);
    })


    test('deleting', async () => {
        const res = await request(app)
            .delete(`/recipe/${1}/comments/${1}`)
            .set('Cookie', ['session=01']) 
        expect(res.status).toBe(200);
    })

    test('deleting w/ bad recipe', async () => {
        (prisma.recipe.findUnique as unknown as Mock).mockImplementationOnce(() => {
            return Promise.resolve(undefined);
        });
        const res = await request(app)
            .delete(`/recipe/${1}/comments/${1}`)
            .set('Cookie', ['session=01']) 
        expect(res.status).toBe(404);
    })

    test('deleting w/ bad comment', async () => {
        (prisma.comment.findUnique as unknown as Mock).mockImplementationOnce(() => {
            return Promise.resolve(undefined);
        });
        const res = await request(app)
            .delete(`/recipe/${1}/comments/${1}`)
            .set('Cookie', ['session=01']) 
        expect(res.status).toBe(404);
    })

    test('deleting w/ bad comment recipeId', async () => {
        (prisma.comment.findUnique as unknown as Mock).mockImplementationOnce(() => {
            return Promise.resolve({
                recipe: {
                    id: 2
                }
            });
        });
        const res = await request(app)
            .delete(`/recipe/${1}/comments/${1}`)
            .set('Cookie', ['session=01']) 
        expect(res.status).toBe(400);
    })


})