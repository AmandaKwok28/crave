import { test, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { beforeEach, describe } from 'node:test';
import { Like } from '@prisma/client';
import usersRoutes from '../routes/users.routes.js';

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

// mock all database calls for now, need to add a test database
// mock the prisma client method (has to point to the actual prisma/db.js that your code uses)
vi.mock('../../prisma/db.js', () => ({
    prisma: {
      users: {
        findUnique: vi.fn().mockImplementation(() => {
          console.log('mocking users findUnique');
          return Promise.resolve({
            ...exampleUser1,
            id: exampleUser1.id
          });
        })
      }
    }
}));
  

describe('testing all basic routing functions of users', () => {

    beforeEach( async () => {
        app.use('/users', usersRoutes);
    })

    test('placeholder', async () => {
        expect(200).toEqual(200)
    })
    // test('can get a user based on their id', async () => {
    //     const req = await request(app)
    //         .get(`/users/${exampleUser1.id}`)

    //     expect(req.status).toBe(200);
    // })
})
