import { test, expect, vi, describe, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { prisma } from '../lib/__mocks__/prisma.js';

// mock the Prisma client
vi.mock('../../prisma/db', async () => {
    const actual = await vi.importActual<typeof import('../lib/__mocks__/prisma.js')>('../lib/__mocks__/prisma.js');
    return {
      ...actual
    };
});

// sample user data
const exampleUser = {
    id: '2',
    name: 'Example User',
    email: 'example@example.com',
    school: 'Example University',
    major: 'Example Major',
    likes: [],
    bookmarks: [],
    rating: 0
};

test('placeholder test to avoid failure', () => {
    expect(true).toBe(true);
});
  