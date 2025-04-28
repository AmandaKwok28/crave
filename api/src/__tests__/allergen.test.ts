import { test, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { prisma } from '../lib/__mocks__/prisma.js';
import { seedAllergens } from '../routes/allergens.js';

// mock the Prisma client
vi.mock('../../prisma/db', async () => {
    const actual = await vi.importActual<typeof import('../lib/__mocks__/prisma.js')>('../lib/__mocks__/prisma.js');
    return {
      ...actual
    };
});

const mock_date = new Date('2023-08-15');

const exampleAllergens = [
    {id: 1, name: 'peanuts', createdAt: mock_date },
    {id: 2, name: 'soy', createdAt: mock_date },
    {id: 3, name: 'wheat', createdAt: mock_date },
    {id: 4, name: 'diary', createdAt: mock_date }
];

// get 
test('test that you can retrieve the allergen table in the database', async() => {
    prisma.allergen.findMany.mockResolvedValue([
        ...exampleAllergens,
    ]);
    
    const response = await request(app)
        .get('/allergens');
    
    expect(response.status).toBe(200);

    // make sure the date formatting is the same
    const parsed = response.body.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
    }));
      
    expect(parsed).toEqual(exampleAllergens);
})

test('seeding allergens works', async () => {
    const res = await seedAllergens();
    expect(res).toBe(true);
})