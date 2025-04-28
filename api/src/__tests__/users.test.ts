import { test, expect, vi, type Mock } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { beforeEach, describe } from 'node:test';
import { Like } from '@prisma/client';
import usersRoutes from '../routes/users.routes.js';
import { prisma } from '../../prisma/db.js';

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

// mock all database calls for now, need to add a test database
// mock the prisma client method (has to point to the actual prisma/db.js that your code uses)
vi.mock('../../prisma/db.js', () => ({
    prisma: {
      user: {
        findUnique: vi.fn().mockImplementation(() => {
          console.log('mocking users findUnique');
          return Promise.resolve({
            ...exampleUser1,
            id: exampleUser1.id
          });
        })
      },
      follow: {
        create: vi.fn().mockImplementation(() =>{
          return Promise.resolve({
            followerId: '2def',
            followingId: '1abc'
          })
        }),
        delete: vi.fn().mockImplementation(() => {
          return Promise.resolve({
            followerId: '2def',
            followingId: '1abc'
          })
        }),
        findMany: vi.fn().mockImplementation(() => {
          return Promise.resolve([{
            followerId: '2def',
            followingId: exampleUser1.id,
            follower: exampleUser2
          }])
        })
      }
    }
}));
  

describe('testing all basic routing functions of users', () => {

    beforeEach( async () => {
        app.use('/users', usersRoutes);
    })

    test('can get a user based on their id', async () => {
        const req = await request(app)
            .get(`/users/${exampleUser1.id}`)

        expect(req.status).toBe(200);
    })

    test('user does not exist so get route should fail', async () => {
      // mock the findUnique to return null
      (prisma.user.findUnique as unknown as Mock).mockImplementationOnce(() => Promise.resolve(null));
      const req = await request(app)
        .get(`/users/${exampleUser1.id}`)

      expect(req.status).toBe(404);
    })

    test('testing post route works', async () => {
      const req = await request(app)
        .post(`/users/${exampleUser1.id}/follow`)
        .send({
          followerId: '2def'
        })
      
      expect(req.status).toBe(200);
    })

    test('post route fails when followerId missing', async () => {
      const req = await request(app)
        .post(`/users/${exampleUser1.id}/follow`)
        .send({
          followerId: null
        })
      
      expect(req.status).toBe(400);
    })

    test('post route fails when followerId = userId', async () => {
      const req = await request(app)
        .post(`/users/${exampleUser1.id}/follow`)
        .send({
          followerId: exampleUser1.id
        })
      
      expect(req.status).toBe(400);
    })

    test('testing delete route works', async () => {
      const req = await request(app)
        .delete(`/users/${exampleUser1.id}/unfollow`)
        .send({
          followerId: exampleUser1.id
      })

      expect(req.status).toBe(200);
    })

    test('delete fails when follwerId missing', async () => {
      const req = await request(app)
        .delete(`/users/${exampleUser1.id}/unfollow`)
        .send({
          followerId: null
      })

      expect(req.status).toBe(400);
    })

    test('delete fails due to database connection', async () => {
      (prisma.follow.delete as unknown as Mock).mockImplementationOnce(() => {
        throw new Error('Database connection failed');
      });
      const req = await request(app) 
        .delete(`/users/${exampleUser1.id}/unfollow`)
        .send({
          followerId: exampleUser1.id
        })
      expect(req.status).toBe(500);
    })

    test('getting followers of another user', async () => {
      const req = await request(app)
        .get(`/users/${exampleUser1.id}/followers`)

      expect(req.status).toBe(200);
    })

    test('test that get followers has database connection error', async () => {
      (prisma.follow.findMany as unknown as Mock).mockImplementationOnce(() => {
        throw new Error('Database connection failed');
      });

      const req = await request(app)
        .get(`/users/${exampleUser1.id}/followers`)

      expect(req.status).toBe(500)

    })

    test('get following list of a user', async () => {
      const req = await request(app)
        .get(`/users/${exampleUser1.id}/following`)

      expect(req.status).toBe(200)
    })

    test('test that get following has database connection error', async () => {
      (prisma.follow.findMany as unknown as Mock).mockImplementationOnce(() => {
        throw new Error('Database connection failed');
      });

      const req = await request(app)
        .get(`/users/${exampleUser1.id}/following`)

      expect(req.status).toBe(500)

    })
})
