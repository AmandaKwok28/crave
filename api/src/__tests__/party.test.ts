import { test, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { beforeEach, describe } from 'node:test';
import { Like, PartyStatus } from '@prisma/client';
import partyRoutes from '../routes/party.routes.js';


// set up example variables
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

const cookingPartyEx = {
  id: "1abc",
  name: 'user1',
  createdAt: new Date('2025-08-14'),
  updatedAt: new Date('2025-08-14'),
  status: PartyStatus.ACTIVE,
  shareLink: 'fake.link',
  expiresAt: new Date('2025-08-14'),
  hostId: '1abc', // Changed to match test user ID
  host: {
      id: '1abc',
      name: 'Example User 1',
      avatarImage: ''
  },
  members: [{
      userId: '1abc',
      user: exampleUser1
  }],
  preferences: null,
  isHost: true // This will be added by your route
};

const exampleDate = new Date('2025-08-14');

const examplePartyMember = {
  id: 1,             
  partyId: cookingPartyEx.id,
  userId: exampleUser1.id,
  joinedAt: exampleDate,
  hasAccepted: false,
  party: cookingPartyEx,
  user: exampleUser1,
  ingredients: ['cook it'],
  cookingAbility: null
};




// mock the prisma client method (has to point to the actual prisma/db.js that your code uses)
vi.mock('../../prisma/db.js', () => ({
  prisma: {
    cookingParty: {
      findMany: vi.fn().mockImplementation(() => {
        console.log('Mock findMany called');
        return Promise.resolve([{
          ...cookingPartyEx,
          members: cookingPartyEx.members.map(m => ({
            ...m,
            user: exampleUser1
          })),
          host: {
            id: exampleUser1.id,
            name: exampleUser1.name,
            avatarImage: exampleUser1.avatarImage
          }
        }]);
      }),
      create: vi.fn().mockImplementation(() => {
        console.log('using cooking Party create mock!');
        return Promise.resolve(cookingPartyEx);
      }),
      findUnique: vi.fn().mockImplementation(() => {
        console.log('using cooking Party findUnique mock!');
        return Promise.resolve({
          ...cookingPartyEx,
          shareLink: cookingPartyEx.shareLink,
          preferences: { 
            availableTime: 10,
            preferredCuisines: 'Japanese',
            aggregatedIngredients: 'peanuts',
            excludedAllergens: 'peanuts',
            preferredPrice: 'PRICEY',
            preferredDifficulty: 'HARD', 
          },
          recommendations: {
            id: '1',
            partyId: cookingPartyEx.id,
            recipeId: '1',
            createdAt: exampleDate,
            recipe: null,
          }
        });
      }),
      delete: vi.fn().mockImplementation(() => {
        return Promise.resolve(cookingPartyEx);
      })
    },
    partyMember: {
      create: vi.fn().mockImplementation(() => {
        console.log('using partyMember create mock!');
        return Promise.resolve(examplePartyMember);
      }),
      findFirst: vi.fn().mockImplementation(() => {
        console.log('using partyMember findFirst mock!');
        return Promise.resolve(null);
      }),
    },
    partyPreference: {
      upsert: vi.fn().mockImplementation(() => {
        return Promise.resolve({
          preferences: { 
            availableTime: 10,
            preferredCuisines: 'Japanese',
            aggregatedIngredients: 'peanuts',
            excludedAllergens: 'peanuts',
            preferredPrice: 'PRICEY',
            preferredDifficulty: 'HARD', 
          }
        })
      })
    }
  }
}));


// mock the authguard and inject it into the test
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



describe('testing all the routes for party routes', () => {

    // set up proper mocks for all the tests
    beforeEach(async () => {
        app.use('/party', partyRoutes);
    });


    test('testing getting all parties for the current user (as host or member)', async () => {  

      // mock the cooking party call
      const response = await request(app)
          .get('/party/my')
          .set('Cookie', [
              'session=01'
          ]);


      expect(response.body).toBeDefined();
      expect(response.body).toMatchObject([
        expect.objectContaining({
          id: cookingPartyEx.id,
          hostId: cookingPartyEx.hostId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          expiresAt: expect.any(String),
        }),
      ]);
      
      expect(response.status).toBe(200);
      
    })

    test('creating a new party', async () => {
      const req = await request(app)
        .post('/party/')
        .send({
          name: 'test party',
          expiresAt: exampleDate
      })

      expect(req.status).toBe(201);
    })

    test('deleting a cooking party', async () => {
      const req = await request(app)
        .delete(`/party/${exampleUser1.id}`)

      expect(req.status).toBe(200);
    })

    test('join sharelink', async () => {
      const req = await request(app)
        .post(`/party/join/${cookingPartyEx.shareLink}`)
        .send({
          ingredients: ['peanuts'],
          cookingAbility: null
        })

      expect(req.status).toBe(201);
    })

    test('Get a single party by sharelink', async () => {
      const req = await request(app)
        .get(`/party/${cookingPartyEx.shareLink}`)
      
      expect(req.status).toBe(200);
    })


    test('Get party preferences by sharelink', async () => {
      const req = await request(app) 
        .get(`/party/pref/${cookingPartyEx.shareLink}`)
      
      expect(req.status).toBe(200);
    })

    test('test that you can update party preferences', async () => {
      const req = await request(app)
        .put(`/party/${cookingPartyEx.id}/preferences`)
        .send({
          availableTime: 10,
          preferredCuisines: "japanese",
          preferredPrice: "PRICEY",
          aggregatedIngredients: 'peanuts',
          excludedAllergens: 'peanuts',
          preferredDifficulty: "HARD"
        })

      expect(req.status).toBe(200);

    })

    test('remove user from a party fails if user is not a member', async () => {
      const req = await request(app)
        .delete(`/party/${cookingPartyEx.id}/members/${exampleUser1.id}`)

      expect(req.status).toBe(404);
    })

    // Get party recommendations by share link
    test('get party recommendations by sharelink', async () => {
      const req = await request(app)
        .get(`/party/recommendations/${cookingPartyEx.shareLink}`)

      expect(req.status).toBe(200)
    })

    // call python script to update recommended recipes
    test('call python script to update recommended recipes', async () => {
      const req = await request(app)
        .post(`/party/${cookingPartyEx.id}/gen/recommendations`)

      expect(req.status).toBe(200);
    })


})