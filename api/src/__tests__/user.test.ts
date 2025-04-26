import { test, expect, vi, type Mock } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { beforeEach, describe } from 'node:test';
import { Like } from '@prisma/client';
import { prisma } from '../../prisma/db.js';
import userRoutes from '../routes/user.routes.js'

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
      user: {
        findUnique: vi.fn().mockImplementation(() => ({
          ...exampleUser1,
          id: exampleUser1.id,
          recipes: vi.fn().mockResolvedValue([]) 
        })),
        update: vi.fn().mockImplementation(({ where, data }) => ({
            ...exampleUser1,
            avatarImage: data.avatarImage,
            email: where.email
        }))
      },
      recipe: {
        findUnique: vi.fn().mockImplementation(() => {
            return Promise.resolve(exampleRecipe)
        }),
        findMany: vi.fn().mockImplementation(() => {
            return Promise.resolve([exampleRecipe])
        })
      },
      recentlyViewed: {
        upsert: vi.fn().mockImplementation(() => {
            return Promise.resolve({
                id: '1',
                userId: exampleUser1.id,
                recipeId: '1',
                viewedAt: new Date()
            })
        }),
        count: vi.fn().mockImplementation(() => {
            return Promise.resolve(5)
        }),
        deleteMany: vi.fn().mockImplementation(() => {
            return Promise.resolve([]);
        }),
        findMany: vi.fn().mockImplementation(() => {
            return Promise.resolve([]);
        })
      },
      recommendedRecipe: {
        findMany: vi.fn().mockImplementation(() => {
            return Promise.resolve([]);
        })
      }
    }
}));





describe('testing all user routes', () => {

    beforeEach(() => {
        app.use('/user', userRoutes);
    })

    test('get user published recipes', async () => {
        const req = await request(app)
            .get(`/user/recipes`)
            .set('Cookie', [
              'session=01'
            ]);

        expect(req.status).toBe(200);
    })

    test('get user drafted recipes', async () => {
        const req = await request(app)
            .get(`/user/drafts`)
            .set('Cookie', [
                'session=01'
            ]);
        
        expect(req.status).toBe(200);
    })

    test('test drafts not found for get', async () => {
        (prisma.user.findUnique as unknown as Mock).mockImplementationOnce(() => ({
            ...exampleUser1,
            id: exampleUser1.id,
            recipes: vi.fn().mockResolvedValue(null) 
          }));

        const req = await request(app)
            .get(`/user/drafts`)
            .set('Cookie', [
                'session=01'
            ]);
        
        expect(req.status).toBe(404);
    })

    test('update user avatar', async () => {
        const req = await request(app)
          .patch('/user/avatar') 
          .set('Cookie', ['session=01'])  
          .send({
            email: exampleUser1.email,
            url: 'http://fake.com'  
          });
      
        expect(req.status).toBe(200);
    });

    test('avatar schema failed', async () => {
        const req = await request(app)
            .patch('/user/avatar')
        
        expect(req.status).toBe(400);
    })

    test('avatar patch internal server error', async () => {
        (prisma.user.update as unknown as Mock).mockImplementationOnce(() => {
            throw new Error('Database connection failed');
        });
        const req = await request(app)
            .patch('/user/avatar')
            .set('Cookie', ['session=01'])  
            .send({
                email: exampleUser1.email,
                url: 'http://fake.com'  
            });
        
        expect(req.status).toBe(500);
    })

    test('set recently viewed', async () => {
        const req = await request(app)
            .post(`/user/recently-viewed/${1}`)
            .set('Cookie', ['session=01'])  

        expect(req.status).toBe(200);
    })

    test('set recently viewed for greater than 10 recipes', async () => {
        const req = await request(app)
            .post(`/user/recently-viewed/${1}`)
            .set('Cookie', ['session=01'])  

        expect(req.status).toBe(200);
    })

    test('recipe id invalid', async () => {
        (prisma.recipe.findUnique as unknown as Mock).mockImplementationOnce(() => {
            return Promise.resolve(null);
        });
        const req = await request(app)
            .post(`/user/recently-viewed/${1}`)
            .set('Cookie', ['session=01'])  

        expect(req.status).toBe(404);
    })

    test('recently viewed internal server error', async () => {
        (prisma.recipe.findUnique as unknown as Mock).mockImplementationOnce(() => {
            throw new Error('Internal server error');
        });
        const req = await request(app)
            .post(`/user/recently-viewed/${1}`)
            .set('Cookie', ['session=01'])  

        expect(req.status).toBe(500);
    })

    test('get recently viewed', async () => {
        const req = await request(app)
            .get(`/user/recently-viewed`)
            .set('Cookie', ['session=01'])  

        expect(req.status).toBe(200);
    })

    test('get recently veiwed server error', async () => {
        (prisma.recentlyViewed.findMany as unknown as Mock).mockImplementationOnce(() => {
            throw new Error('Internal server error');
        });
        const req = await request(app)
            .get(`/user/recently-viewed`)
            .set('Cookie', ['session=01'])  

        expect(req.status).toBe(500);
    })

    test('get recommended recipes', async () => {
        const req = await request(app)
            .get(`/user/recommended`)
            .set('Cookie', ['session=01'])  
            .query({ limit: '5' })  

        expect(req.status).toBe(200)
    })

    test('get recommended with server error', async () => {
        (prisma.recommendedRecipe.findMany as unknown as Mock).mockImplementationOnce(() => {
            throw new Error('Internal server error');
        });
        const req = await request(app)
            .get(`/user/recommended`)
            .set('Cookie', ['session=01'])  
            .query({ limit: '5' })  
        expect(req.status).toBe(500)
    })
})
  