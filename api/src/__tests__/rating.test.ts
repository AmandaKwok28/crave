import { test, expect, vi, describe, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { prisma } from '../lib/__mocks__/prisma.js';

// note: no testing on user2 interaction with user1 content becuase that is maintained by the frontend

// mock the Prisma client
vi.mock('../../prisma/db', async () => {
    const actual = await vi.importActual<typeof import('../lib/__mocks__/prisma.js')>('../lib/__mocks__/prisma.js');
    return {
      ...actual
    };
});

// sample user data
const exampleUser = {
    id: '1',
    name: 'Example User',
    email: 'example@example.com',
    school: 'Example University',
    major: 'Example Major',
    likes: [],
    bookmarks: [],
    avatarImage: null,
    passwordHash: 'fakehash',
    rating: 0
};

const exampleUser2 = {
    id: '2',
    name: 'Example2 User',
    email: 'example2@example.com',
    school: 'Example University',
    major: 'Example Major',
    likes: [],
    bookmarks: [],
    avatarImage: null,
    passwordHash: 'fakehash',
    rating: 0
};


  


// make sure there's an exampleUser in the database before testing
beforeEach(async () => {

    prisma.user.findUnique.mockResolvedValue(exampleUser);
    prisma.user.findUnique.mockResolvedValue(exampleUser2);

});


describe('Route Testing GET and PUT', () => {

    // test that you can get the rating
    test('can fetch a user rating via GET /:id/rating', async () => {

        // mock the initial user lookup
        prisma.user.findUnique.mockResolvedValue(exampleUser);
        const res = await request(app).get(`/${exampleUser.id}/rating`);
    
        // make sure the request goes through and that the body is correct
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            message: 'Success!',
            rating: exampleUser.rating
        });
        
        // confirm that `prisma.user.findUnique` was called with the correct arguments
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: exampleUser.id }
        });
    });


    // test that you can adjust the rating
    test('can update a user rating via PUT /:id/rating', async () => {

        prisma.user.findUnique.mockResolvedValue(exampleUser);
    
        const type = 'like'; // or any other valid type
        const delta = 1; // based on the ratingDelta map
        const newRating = exampleUser.rating + delta;
    
        prisma.user.update.mockResolvedValue({
            ...exampleUser,
            rating: newRating,
        });
    
        const res = await request(app)
            .put(`/${exampleUser.id}/rating`)
            .send({ type });
    
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('User rating successfully updated');
        expect(res.body.user.rating).toBe(newRating);
    
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: exampleUser.id }
        });
    
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: exampleUser.id },
            data: { rating: newRating }
        });
    });
    

})



