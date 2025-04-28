/// <reference types="node" />
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/password.js';
import testRecipesTextData from '../src/seed_helpers/generate_recipe_data.js';

const prisma = new PrismaClient()

const exampleUser1 = {
  id: '1abc',
  name: 'Example User 1',
  email: 'example1@example.com',
  school: 'Example University',
  major: 'Example Major',
  rating: 0
};

const testRecipesData = [ {
  published: true,
  title: testRecipesTextData[0].title,
  description: testRecipesTextData[0].description,
  ingredients: testRecipesTextData[0].ingredients,
  instructions: testRecipesTextData[0].instructions,
  authorId: '1abc',
  createdAt: new Date(),
  updatedAt: new Date(),
  //Additional
  mealTypes: [],
  price: null,
  cuisine: null,
  allergens: [],
  difficulty: null,
  sources: [],
  prepTime: null
}]

for (let i = 0; i < testRecipesTextData.length; i++) {
  testRecipesData[i] = {
    published: true,
    title: testRecipesTextData[i].title,
    description: testRecipesTextData[i].description,
    ingredients: testRecipesTextData[i].ingredients,
    instructions: testRecipesTextData[i].instructions,
    authorId: '1abc',
    createdAt: new Date(),
    updatedAt: new Date(),
    //Additional
    mealTypes: [],
    price: null,
    cuisine: null,
    allergens: [],
    difficulty: null,
    sources: [],
    prepTime: null
  }
}

export async function main2() {
  console.log(`Start seeding ...`);

  // Clean up in correct order
  await prisma.recipe.deleteMany();
  await prisma.user.deleteMany();
  console.log("Deleted all data");

  // Add user with upsert
  const user = await prisma.user.upsert({
    where: { email: exampleUser1.email },
    update: {},
    create: {
      ...exampleUser1,
      passwordHash: await hashPassword('password')
    }
  });
  console.log(`Created user with id: ${user.id}`);

  // Create recipes using the actual user ID
  for (const testRecipe of testRecipesData) {
    const recipe = await prisma.recipe.create({
      data: {
        ...testRecipe,
        authorId: user.id // Use the actual user ID
      }
    });
    console.log(`Created recipe with id: ${recipe.id}`);
  }
  
  console.log(`Seeding finished.`)
  return true;
}


if (process.env.NODE_ENV !== 'test') {
  // In production/development, exit on error
  main2()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
} else {
  // In test environment, don't exit on error
  main2()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error('Seeding error during tests:', e)
      await prisma.$disconnect()
      // Don't exit process during tests!
    })
}

