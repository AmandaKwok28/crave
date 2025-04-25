/// <reference types="node" />
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/password.js';
import testRecipesTextData from '../src/seed_helpers/generate_recipe_data.js';

const prisma = new PrismaClient()


const allergens = [
  "Peanuts", "Tree nuts", "Milk", "Eggs", "Wheat", "Soy", "Fish", "Shellfish", "Sesame",
  "Apples", "Bananas", "Peaches", "Cherries", "Strawberries", "Kiwis", "Oranges", "Lemons", "Grapes", "Mangos", "Plums",
  "Celery", "Carrots", "Tomatoes", "Potatoes", "Bell peppers", "Cucumbers", "Avocados", "Onions", "Garlic", "Lettuce",
  "Barley", "Rye", "Oats", "Corn", "Lentils", "Chickpeas", "Peas", "Green beans", "Lupin", "Quinoa",
  "Casein", "Whey", "Lactose", "Egg yolk", "Egg white",
  "Cashews", "Walnuts", "Almonds", "Pistachios", "Hazelnuts", "Pecans", "Macadamia nuts", "Brazil nuts", "Pine nuts",
  "Sunflower seeds", "Pumpkin seeds", "Chia seeds", "Flaxseeds",
  "Beef", "Pork", "Chicken", "Turkey", "Lamb", "Shrimp", "Crab", "Lobster", "Clams", "Mussels", "Oysters", "Squid",
  "Tuna", "Salmon", "Cod", "Anchovies",
  "Mustard", "Cinnamon", "Nutmeg", "Paprika", "Black pepper", "Cumin", "Coriander", "Basil", "Oregano", "Thyme",
  "MSG", "Gelatin", "Xanthan gum", "Guar gum", "Malt", "Artificial food colorings", "Artificial sweeteners", "Yeast",
  "Soy lecithin", "Cocoa", "Vinegar", "Soy sauce", "Miso", "Tempeh", "Kimchi", "Pickles", "Wine", "Beer", "Hard cheeses",
  "Mayonnaise", "Marshmallows"
];

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

async function main() {
  console.log(`Start seeding ...`)

  //deleting existing data
  await prisma.user.deleteMany();
  console.log("Deleted all users");

  // Add user
  const user = await prisma.user.create({
    data: {
      ...exampleUser1,
      passwordHash: await hashPassword('password')
    }
  })
  console.log(`Created user with id: ${user.id}`)

  // adding batch of test recipes
  for (const testRecipe of testRecipesData) {
    const recipe = await prisma.recipe.create({
      data: {
          ...testRecipe
      }
    })
    console.log(`Created recipe with id: ${recipe.id}`)
  }

  // adding allergens
  for (const allergen of allergens) {
    await prisma.allergen.upsert({
      where: { name: allergen },
      update: {},
      create: { name: allergen },
    });
  }
  console.log("✅ Allergens seeded successfully!");
  
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
