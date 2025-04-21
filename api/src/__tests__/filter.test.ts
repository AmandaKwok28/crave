import { test, expect, vi, describe, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { prisma } from '../lib/__mocks__/prisma.js';
import { Cuisine, Difficulty, Price } from '@prisma/client';

// Mock the Prisma client
vi.mock('../../prisma/db', async () => {
  const actual = await vi.importActual<typeof import('../lib/__mocks__/prisma.js')>('../lib/__mocks__/prisma.js');
  return {
    ...actual
  };
});

// Sample user data
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

// Sample recipe data
const sampleRecipes = [
 {
    id: 2,
    published: true,
    title: 'Spaghetti Carbonara',
    description: 'A creamy and rich Italian pasta dish made with eggs, cheese, pancetta, and pepper.',
    ingredients: [
      'Spaghetti',
      'Pancetta',
      'Eggs',
      'Pecorino Romano Cheese',
      'Parmesan cheese',
      'Garlic',
      'Salt',
      'Black Pepper',
      'Olive Oil'
    ],
    instructions: [
      'Cook spaghetti according to package instructions until al dente. Reserve 1 cup pasta water and drain. In a bowl, \
      whisk eggs, Pecorino Romano, Parmesan, salt, and black pepper together. In a pan over medium heat, cook pancetta in \
      olive oil until crispy, then add minced garlic for 30 seconds. Reduce heat and toss spaghetti with pancetta. Remove \
      pan from heat and slowly mix in egg mixture, adding pasta water as needed for a creamy consistency. Serve \
      immediately with extra cheese and black pepper.'
    ],
    image: 'spaghetti-carbonara.jpg',
    authorId: '2',
    author: exampleUser,
    createdAt: new Date(),
    updatedAt: new Date(),
    viewCount: 0,
    mealTypes: ['dinner'],
    price: 'MODERATE' as Price,
    cuisine: 'ITALIAN' as Cuisine,
    allergens: ['eggs', 'dairy'],
    difficulty: 'MEDIUM' as Difficulty,
    prepTime: 30,
    sources: ['CharMar'],
    likes: [],
    bookmarks: []
  }
]

beforeEach(() => {
    vi.clearAllMocks();
    prisma.recipe.findMany.mockResolvedValue(sampleRecipes);
  });

describe('Successfull filtration', () => {

// Meal Types
test('Filter recipes by meal types', async () => {
    const response = await request(app)
      .get('/feed?mealTypes=dinner');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0].mealTypes).toContain('dinner');
  });

// Price
test('Filter recipes by price', async () => {
    const response = await request(app)
      .get('/feed?price=MODERATE');
    
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0].price).toBe('MODERATE');
  });


// Cuisine
  test('Filter recipes by cuisine', async () => {
    const response = await request(app)
      .get('/feed?cuisine=ITALIAN');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0].cuisine).toBe('ITALIAN');
  });

// Allergens
test('Filter recipes by allergens', async () => {
    const response = await request(app)
      .get('/feed?allergens=eggs');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0].allergens).toContain('eggs');
  });

// Difficulty
test('Filter recipes by difficulty', async () => {
    const response = await request(app)
      .get('/feed?difficulty=MEDIUM');
    
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0].difficulty).toContain('MEDIUM');
  });

// Prep Time
  test('Filter recipes by prep time', async () => {
    const response = await request(app)
      .get('/feed?maxPrepTime=40');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0].prepTime).toBeLessThanOrEqual(40);
  });

// Sources
    test('Filter recipes by sources', async () => {
    const response = await request(app)
      .get('/feed?sources=CharMar');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0].sources).contains("CharMar");
  });

  // Major
  test('Filter recipes by majors', async () => {
    const response = await request(app)
      .get('/feed?major=Example Major');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0].author.major).toBe("Example Major");
  });

  // Multiple filters
  test('Filter recipes with multiple filters', async () => {
    const response = await request(app).get('/feed?mealTypes=dinner&price=MODERATE&cuisine=ITALIAN');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].mealTypes).toContain('dinner');
    expect(response.body[0].price).toBe('MODERATE');
    expect(response.body[0].cuisine).toBe('ITALIAN');
  });

  // No matching results
  test('Filter recipes with no matching results', async () => {
    prisma.recipe.findMany.mockResolvedValue([]);
    const response = await request(app).get('/feed?cuisine=JAPANESE');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  // Invalid filter query
  test('Handle invalid filter parameters gracefully', async () => {
    const response = await request(app)
      .get('/feed?cuisine=somevalue');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
  
  // Pagination
  test('Pagination - limit results', async () => {
    prisma.recipe.findMany.mockResolvedValue(sampleRecipes.slice(0, 1));
    const response = await request(app).get('/feed?limit=1');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });


});