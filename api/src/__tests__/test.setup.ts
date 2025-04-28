import dotenvFlow from 'dotenv-flow';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { prisma } from '../../prisma/db.js';

dotenvFlow.config();

beforeAll(async () => {
    try {
        await prisma.$connect();
    } catch (err) {
        console.error('failed to connect');
    }
   
});

afterAll(async () => {
    await prisma.$disconnect();
});
