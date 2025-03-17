import { test, expect, vi, describe, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { hashPassword } from '../lib/password.js';
import { prisma } from '../lib/__mocks__/prisma.js';

vi.mock('../../prisma/db', async () => {
  return {
    ...await vi.importActual<typeof import('../lib/__mocks__/prisma.js')>('../lib/__mocks__/prisma.js')
  };
});

const exampleUser = {
  id: '1',
  name: 'Example User',
  email: 'example@example.com',
  school: 'Example University',
  major: 'Example Major',
  likes: [],
  bookmarks: []
};

describe('Account registration', () => {
  beforeEach(async () => {
    prisma.user.create.mockResolvedValue({
      ...exampleUser,
      passwordHash: await hashPassword('password')
    });
  });

  test('Successful registration', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        ...exampleUser,
        password: 'password'
      });

    expect(response.body).toStrictEqual({ data: exampleUser });
    expect(response.status).toBe(200);
  });

  test('Unsuccessful registration', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        email: 'invalid@example.com'
      });

    expect(response.status).toBe(400);
  });
});

describe('Account login', () => {
  beforeEach(async () => {
    prisma.user.findUnique.mockResolvedValue({
      ...exampleUser,
      passwordHash: await hashPassword('password')
    });
  });

  test('Successful login', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: exampleUser.email,
        password: 'password'
      });

    expect(response.body).toStrictEqual({
      message: 'You have been signed in!',
      data: exampleUser
    });

    expect(response.status).toBe(200);
  });

  test('Unsuccessful login', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: exampleUser.email,
        password: 'invalid'
      });

    expect(response.body).toStrictEqual({
      message: 'Incorrect Login'
    });

    expect(response.status).toBe(401);
  });
});

describe('Session validation', async () => {
  test('Successful validation', async () => {
    prisma.session.findUnique.mockResolvedValue({
      id: '01',
      userId: '1',
      expiresAt: new Date(Date.now() + 1_000_000),
      //@ts-ignore
      user: {
        ...exampleUser,
        passwordHash: 'test'
      }
    });
  
    const response = await request(app)
      .get('/validate-session')
      .set('Cookie', [
        'session=01'
      ]);
  
    expect(response.body).toStrictEqual({
      message: 'Successfully authenticated'
    });
  
    expect(response.status).toBe(200);
  });

  test('Unsuccessful validation', async () => {
    prisma.session.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .get('/validate-session')
      .set('Cookie', [
        'session=01'
      ]);
  
    expect(response.body).toStrictEqual({
      message: 'Unauthorized'
    });
  
    expect(response.status).toBe(401);  
  });
});

describe('Logout', async () => {
  test('Successful logout', async () => {
    prisma.session.findUnique.mockResolvedValue({
      id: '01',
      userId: '1',
      expiresAt: new Date(Date.now() + 1_000_000),
      //@ts-ignore
      user: {
        ...exampleUser,
        passwordHash: 'test'
      }
    });

    const response = await request(app)
      .post('/logout')
      .set('Cookie', [
        'session=01'
      ]);

    expect(response.body).toStrictEqual({
      message: 'Successfully logged out'
    });
  
    expect(response.status).toBe(200);  
  });

  test('Unsuccessful logout', async () => {
    prisma.session.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post('/logout')
      .set('Cookie', [
        'session=01'
      ]);

    expect(response.body).toStrictEqual({
      message: 'Unauthorized'
    });
  
    expect(response.status).toBe(401);  
  })
});

describe('Get user', async () => {
  test('Successful get', async () => {
    prisma.session.findUnique.mockResolvedValue({
      id: '01',
      userId: '1',
      expiresAt: new Date(Date.now() + 1_000_000),
      //@ts-ignore
      user: {
        ...exampleUser,
        passwordHash: 'test'
      }
    });

    const response = await request(app)
      .get('/get-user')
      .set('Cookie', [
        'session=01'
      ]);

    expect(response.body).toStrictEqual({
      data: exampleUser
    });
  
    expect(response.status).toBe(200);  
  });

  test('Unsuccessful get', async () => {
    prisma.session.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .get('/get-user')
      .set('Cookie', [
        'session=01'
      ]);

    expect(response.body).toStrictEqual({
      message: 'Unauthorized'
    });

    expect(response.status).toBe(401);  
  });
});
