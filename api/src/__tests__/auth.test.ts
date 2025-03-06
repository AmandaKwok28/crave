import { test, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import { hashPassword } from '../lib/password';
import {prisma} from '../lib/__mocks__/prisma';

vi.mock('../../prisma/db', async () => {
  const actual = await vi.importActual<typeof import('../lib/__mocks__/prisma')>('../lib/__mocks__/prisma');
  return {
    ...actual
  };
});

const exampleUser = {
  id: '1',
  name: 'Example User',
  email: 'example@example.com',
  school: 'Example University',
  major: 'Example Major'
};

test('User account registration', async () => {
  prisma.user.create.mockResolvedValue({
    ...exampleUser,
    passwordHash: await hashPassword('password')
  });

  const response = await request(app)
    .post('/register')
    .send({
      ...exampleUser,
      password: 'password'
    });

  expect(response.body).toStrictEqual({ data: exampleUser });
  expect(response.status).toBe(200);
});

test('Failed user account registration', async () => {
  prisma.user.create.mockResolvedValue({
    ...exampleUser,
    passwordHash: await hashPassword('password')
  });

  const response = await request(app)
    .post('/register')
    .send({
      email: 'invalid@example.com'
    });

  expect(response.status).toBe(400);
});

test('User account login', async () => {
  prisma.user.findUnique.mockResolvedValue({
    ...exampleUser,
    passwordHash: await hashPassword('password')
  });

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

test('Failed user account login', async () => {
  prisma.user.findUnique.mockResolvedValue({
    ...exampleUser,
    passwordHash: await hashPassword('password')
  });

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

test('Valid session validation', async () => {
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

test('Invalid session validation', async () => {
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
