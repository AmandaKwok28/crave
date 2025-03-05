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

test('User account registration', async () => {
  const exampleUser = {
    id: '1',
    name: 'Example User',
    email: 'example@example.com',
    school: 'Example University',
    major: 'Example Major'
  };

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
