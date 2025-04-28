import { 
    test,  
    beforeAll, 
    beforeEach, 
    describe, 
    afterAll,
    expect,
    type Mock,
    vi
} from 'vitest';

import { app } from '../index.js';
import request from 'supertest';
import { prisma } from '../../prisma/db.js';
import messageRoutes from '../routes/message.routes.js'
import { User } from '@prisma/client';

// fake data
const exampleUser1 = {
    name: 'Example User 1',
    email: 'example1@example.com',
    school: 'Example University',
    major: 'Example Major',
    password: 'password'
};

const exampleUser2 = {
    name: 'Example User 2',
    email: 'example2@example.com',
    school: 'Example University2',
    major: 'Example Major2',
    password: 'password2'
};

// seed the database with a user and some fake data
let cookies1 : string[] = [];
let cookies2 : string[] = [];

let user1_id;
let user2_id;

beforeAll( async () => {

    // clear the database
    await prisma.$transaction([
        prisma.recipe.deleteMany(),
        prisma.conversation.deleteMany(),
        prisma.message.deleteMany(),
        prisma.user.deleteMany()
    ]);

    // register user 1
    const res = await request(app)
        .post('/register')
        .send({
            ...exampleUser1
        })

    // register user 2
    const res2 = await request(app)
        .post('/register')
        .send({
            ...exampleUser2
        })

    // get the cookies to bypass the authguard
    user1_id = res.body.data.id;
    cookies1 = Array.isArray(res.headers['set-cookie']) 
        ? res.headers['set-cookie']
        : [res.headers['set-cookie']].filter(Boolean);

    await request(app)
        .post('/login')
        .send({
          email: exampleUser2.email,
          password: exampleUser2.password
        });

    user2_id = res2.body.data.id;
    cookies2 = Array.isArray(res2.headers['set-cookie']) 
    ? res2.headers['set-cookie']
    : [res2.headers['set-cookie']].filter(Boolean);

})

// Clean up test data
afterAll(async () => {
    await prisma.$transaction([
        prisma.recipe.deleteMany(),
        prisma.conversation.deleteMany(),
        prisma.message.deleteMany(),
        prisma.user.deleteMany()
    ]);
});

describe('testing the get routes', () => {
    
    test('get conversations for the current user', async () => {
        const req = await request(app)
            .get(`/message/`)
            .set('Cookie', cookies2);

        // shouldn't have any conversations as a new user
        expect(req.status).toBe(200);
        expect(req.body).toEqual([]);
    })

    test('get conversations when there is a database error', async () => {
        vi.spyOn(prisma.conversation, 'findMany').mockRejectedValueOnce(
            new Error('Simulated DB failure')
        );

        const req = await request(app)
            .get(`/message/`)
            .set('Cookie', cookies1);

        expect(req.status).toBe(500);
    })

})


describe('testing creating a convo, getting by id', () => {

    test('creating a conversation', async () => {
        const res = await request(app)
            .post('/message/')
            .set('Cookie', cookies2)
            .send({
                otherUserId: user1_id    // user 2 currently logged in
            })
       
        expect(res.status).toBe(201);

        
        // Additional database check (as suggested in my previous response)
        const conversation = await prisma.conversation.findFirst({
            where: {
                user1Id: user2_id,
                user2Id: user1_id
            }
        });

        expect(conversation).not.toBeNull();
    })

    let convo_id;
    test('creating a conversation', async () => {
        // conversation created in the previous test so it should return nothing
        const res = await request(app)
            .post('/message/')
            .set('Cookie', cookies2)
            .send({
                otherUserId: user1_id
            })
        
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            id: res.body.id,
            existing: true 
        })

        convo_id = res.body.id;
    })

    test('creating a conversation userId = otherUserId', async () => {
        // conversation created in the previous test so it should return nothing
        const res = await request(app)
            .post('/message/')
            .set('Cookie', cookies2)
            .send({
                otherUserId: user2_id
            })
        
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: 'Cannot start a conversation with yourself'
        })
    })

    test('creating a conversation otherUserId = null', async () => {
        // conversation created in the previous test so it should return nothing
        const res = await request(app)
            .post('/message/')
            .set('Cookie', cookies2)
            .send({
                otherUserId: null
            })
        
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: 'Must specify a user to message'
        })
    })

    test('testing sending a message', async () => {
        const res = await request(app)
            .post(`/message/${convo_id}/messages`)
            .set('Cookie', cookies2)
            .send({
                content: "what's up",
                recipeId: null
            })
        expect(res.status).toBe(201);
    })

    test('sending a message with null content and recipeId', async () => {
        const res = await request(app)
            .post(`/message/${convo_id}/messages`)
            .set('Cookie', cookies2)
            .send({
                content: null,
                recipeId: null
            })
        expect(res.status).toBe(400);
    })

    test('getting messages from a convo', async () => {
        const res = await request(app)
            .get(`/message/${convo_id}/messages`)
            .set('Cookie', cookies2)

        expect(res.status).toBe(200);
    })

    test('getting messages from a convo that doesnt exist', async () => {
        const res = await request(app)
            .get(`/message/${convo_id + 1}/messages`)
            .set('Cookie', cookies2)

        expect(res.status).toBe(403);
    })


    test('get unread messages count', async () => {
        const res = await request(app)
            .get(`/message/unread/count`)
            .set('Cookie', cookies2)

        expect(res.status).toBe(200);
    })


})

