import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [

]

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

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }

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
