import { test, expect, vi, describe, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { hashPassword } from '../lib/password.js';
import { prisma } from '../lib/__mocks__/prisma.js';
import type { Bookmark, Like } from '@prisma/client';

vi.mock('../../prisma/db', async () => {
  return {
    ...await vi.importActual<typeof import('../lib/__mocks__/prisma.js')>('../lib/__mocks__/prisma.js')
  };
});

const exampleLike1: Like = {
  id: 1,
  recipeId: 1,
  userId: '1abc',
  date: new Date(),
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
  likes: [],
  bookmarks: [],
  avatarImage: ''
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
  viewCount: 0,

  // Additional
  mealTypes: [],
  price: null,
  cuisine: null,
  allergens: [],
  difficulty: null,
  sources: [],
  prepTime: null
};

const exampleLike2: Like = {
  id: 2,
  recipeId: 2,
  userId: '2def',
  date: new Date(),
};
const exampleLike2ResponseString = {
  id: 2,
  recipeId: 2,
  userId: '2def',
  date: (new Date()).toISOString(),
};

const exampleUser2 = {
  id: '2def',
  name: 'Example User 2',
  email: 'example2@example.com',
  school: 'Example University',
  major: 'Example Major',
  likes: [exampleLike2],
  bookmarks: [exampleBookmark1],
  avatarImage: ''
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
    bookmarks: [exampleBookmark1],
    authorId: '1abc',
    createdAt: new Date(),
    updatedAt: new Date(),
    viewCount: 0,

    // Additional
    mealTypes: [],
    price: null,
    cuisine: null,
    allergens: [],
    difficulty: null,
    sources: [],
    prepTime: null
};

const exampleLikes = [exampleLike1, exampleLike2]

describe('Create and delete like tests', () => {
    beforeEach(async () => {
        // adding user for testing
        prisma.user.findUnique.mockResolvedValue({
          ...exampleUser1,
          passwordHash: await hashPassword('password')
        });

        // adding recipe for testing
        prisma.recipe.findUnique.mockResolvedValue({
          ...exampleRecipe1
        });

        // adding like for testing
        prisma.like.findUnique.mockResolvedValue({
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
        // adding users for testing
        prisma.user.findUnique.mockResolvedValue({
          ...exampleUser2,
          passwordHash: await hashPassword('password')
        });

        prisma.user.findUnique.mockResolvedValue({
          ...exampleUser1,
          passwordHash: await hashPassword('password')
        });
        
        // adding recipes for testing
        prisma.recipe.findUnique.mockResolvedValue(exampleRecipe1);
        prisma.recipe.findUnique.mockResolvedValue(exampleRecipe2);

        // adding likes for testing
        prisma.like.findUnique.mockResolvedValue(exampleLike1); 
        prisma.like.findUnique.mockResolvedValue(exampleLike2); 
    }); 

    test('Checking get all likes for a given user when they do have likes', async () => {
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
          .get('/get-user')
          .set('Cookie', [
            'session=02'
        ])
      
      expect(response.body.data.likes).toStrictEqual(
          [ {...exampleLike2ResponseString} ]
      );

      expect(response.status).toBe(200);
    });  

    test('Checking get all likes for a given user when they have no likes', async () => {
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
            .get('/like/my')
            .set('Cookie', [
              'session=01'
          ])
        
        expect(response.body).toStrictEqual({
            message: "Likes not found"
        });

        expect(response.status).toBe(404);
    });  
    
    test('Checking if a user has liked a specific recipe when they have not', async () => {
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
            .get('/recipe/1')
            .set('Cookie', [
                'session=01'
            ])
            .send({
            recipeId: exampleRecipe1.id
        });
        
        expect(response.body).contains({
          liked: false
        });

        expect(response.status).toBe(200);
    });  

    test('Checking if a user has liked a specific recipe when they have', async () => {
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
          .get('/recipe/2')
          .set('Cookie', [
              'session=02'
          ])
          .send({
          recipeId: exampleRecipe1.id
      });
      
      expect(response.body).contains({
        liked: true
      });

      expect(response.status).toBe(200);
  });  
});


describe('Create and delete bookmark tests', () => {
  beforeEach(async () => {
      // adding user for testing
      prisma.user.findUnique.mockResolvedValue({
        ...exampleUser2,
        passwordHash: await hashPassword('password')
      });

      // adding recipe for testing
      prisma.recipe.findUnique.mockResolvedValue(exampleRecipe2);

      // adding bookmark for testing
      prisma.bookmark.findUnique.mockResolvedValue(exampleBookmark1); 
  });

  test('Adding a bookmark to a recipe for a user', async () => {
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
          .post('/bookmark/1')
          .set('Cookie', [
              'session=02'
          ])
          .send({
          recipeId: exampleBookmark1.recipeId
      });
      
      expect(response.body).toStrictEqual({
          success: true
      });

      expect(response.status).toBe(200);
  });   

  test('Removing a bookmark from a recipe for a user', async () => {
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
          .delete('/bookmark/2')
          .set('Cookie', [
              'session=02'
          ])
          .send({
          recipeId: exampleBookmark1.recipeId
      });
      
      expect(response.body).toStrictEqual({
          success: true
      });

      expect(response.status).toBe(200);
  });
});

describe('fetch bookmark tests for current user and recipes', () => {
  beforeEach(async () => {
    // adding user for testing
    prisma.user.findUnique.mockResolvedValue({
      ...exampleUser2,
      passwordHash: await hashPassword('password')
    });
    prisma.user.findUnique.mockResolvedValue({
      ...exampleUser1,
      passwordHash: await hashPassword('password')
    });

      // adding recipe for testing
      prisma.recipe.findUnique.mockResolvedValue({
        ...exampleRecipe2
      });

      // adding bookmark for testing
      prisma.bookmark.findUnique.mockResolvedValue({
          ...exampleBookmark1
      }); 
  }); 

  test('Checking get all bookmarks for a given user when they do have bookmarks', async () => {
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
        .get('/get-user')
        .set('Cookie', [
          'session=02'
      ])
    
    expect(response.body.data.bookmarks).toStrictEqual(
        [exampleBookmark1]
    );

    expect(response.status).toBe(200);
  });  

  test('Checking get all bookmarks for a given user when they have no bookmarks', async () => {
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
          .get('/bookmark/my')
          .set('Cookie', [
            'session=01'
        ])
      
      expect(response.body).toStrictEqual({
          message: "Bookmarks not found"
      });

      expect(response.status).toBe(404);
  });  
  
  test('Checking if a user has bookmarked a specific recipe when they have not', async () => {
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
          .get('/recipe/1')
          .set('Cookie', [
              'session=01'
          ])
          .send({
          recipeId: exampleRecipe1.id
      });
      
      expect(response.body).contains({
        bookmarked: false
      });

      expect(response.status).toBe(200);
  });  

  test('Checking if a user has bookmarked a specific recipe when they have', async () => {
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
        .get('/recipe/2')
        .set('Cookie', [
            'session=02'
        ])
        .send({
        recipeId: exampleRecipe1.id
    });
    
    expect(response.body).contains({
      bookmarked: true
    });

    expect(response.status).toBe(200);
});  
});