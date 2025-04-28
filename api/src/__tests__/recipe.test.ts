import { Like } from '@prisma/client';
import { beforeAll, describe, expect, test, vi, type Mock } from 'vitest';
import { app } from '../index.ts';
import recipeRoutes from '../routes/recipe.routes.ts';
import request from 'supertest';
import { prisma } from '../../prisma/db.ts';

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
        recipe: {
            findFirst: vi.fn().mockImplementation(() => {
                return Promise.resolve({
                    authorId: exampleUser1.id
                });
            }),
            update: vi.fn().mockImplementation(() => {
                return Promise.resolve({
                    msg: 'example recipe'
                });
            }),
            findUnique: vi.fn().mockImplementation(() => {
                return Promise.resolve({
                    msg: "updated recipe",
                    published: false,
                    likes: [],
                    bookmarks: []
                })
            }),
            delete: vi.fn().mockImplementation(() => {
                return Promise.resolve({
                    msg: 'deleted recipe'
                })
            })   
        },
        recipeSimilarity: {
            findMany: vi.fn().mockImplementation(() => {
              return Promise.resolve([
                {
                  similarityScore: 0.9,
                  similarRecipe: {
                    id: 123,
                    title: 'Similar Recipe',
                    author: {
                      id: 1,
                      name: 'Author Name'
                    }
                  }
                }
                ])
            }),
        }
    }
}));


describe('adding missing tests here', () => {

    beforeAll(() => {
      app.use('/recipe', recipeRoutes);
    })

    test('get a recipe', async () => {
      const res = await request(app)
        .get('/recipe/1')
      expect(res.status).toBe(200);
    })
  
    test('update a recipe by id', async () => {
      const res = await request(app)
        .patch(`/recipe/${1}/`)
        .send({
          title: 'example', 
          description: 'example', 
          ingredients: ['example'], 
          instructions: 'example', 
          published: 'false',
          image: 'url',
          mealTypes: [],
          difficulty: 'DIFFICULT',
          price: 'PRICEY',
          cuisine: 'ITALIAN',
          allergens: 'peanuts',
          sources: 'charmar',
          prepTime: '10'
        })
      expect(res.status).toBe(200);
    })

    test('validate null', async () => {
        (prisma.recipe.findFirst as unknown as Mock).mockImplementationOnce(() => {
            return Promise.resolve(null);
        });
        const res = await request(app)
        .patch(`/recipe/${1}/`)
        .send({
          title: 'example', 
          description: 'example', 
          ingredients: ['example'], 
          instructions: 'example', 
          published: 'false',
          image: 'url',
          mealTypes: [],
          difficulty: 'DIFFICULT',
          price: 'PRICEY',
          cuisine: 'ITALIAN',
          allergens: 'peanuts',
          sources: 'charmar',
          prepTime: '10'
        })
      expect(res.status).toBe(404);
    })


    test('authorid != res.local.id', async () => {
        (prisma.recipe.findFirst as unknown as Mock).mockImplementationOnce(() => {
            return Promise.resolve({
                authorId: 'test'
            });
        });
        const res = await request(app)
        .patch(`/recipe/${1}/`)
        .send({
          title: 'example', 
          description: 'example', 
          ingredients: ['example'], 
          instructions: 'example', 
          published: 'false',
          image: 'url',
          mealTypes: [],
          difficulty: 'DIFFICULT',
          price: 'PRICEY',
          cuisine: 'ITALIAN',
          allergens: 'peanuts',
          sources: 'charmar',
          prepTime: '10'
        })
      expect(res.status).toBe(401);
    })


    test('get similar recipes', async () => {
        const res = await request(app)
            .get(`/recipe/${1}/similar`)
            .query({
                limit: 1
            })

        expect(res.status).toBe(200)
    })

    test('update recipe views', async () => {
        const res = await request(app)
            .put(`/recipe/${1}/views`)
        
        expect(res.status).toBe(200);
    })
    
    test('toggle recipe publish status', async () => {
        const res = await request(app)
            .put(`/recipe/${1}/publish`)
        expect(res.status).toBe(200);
    })

    test('delete a recipe', async () => {
        const res = await request(app)
            .delete(`/recipe/${1}`)
            .set('Cookie', ['session=01'])  
        expect(res.status).toBe(200);
    })

    test('delete a recipe but failed to be authenticated', async () => {
        const res = await request(app)
            .delete(`/recipe/${1}`)
        expect(res.status).toBe(500);
    })

    test('get single recipe by id', async () => {
        const res = await request(app)
            .get(`/recipe/${1}`)
            .set('Cookie', ['session=01'])  
        expect(res.status).toBe(200);
    }, 10000)
})
  