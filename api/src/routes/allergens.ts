import express from 'express'
import { prisma } from '../../prisma/db.js';

const allergen_route = express.Router();

// on start-up add the allergens to the table...

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

export async function seedAllergens() {
    for (const allergen of allergens) {
      await prisma.allergen.upsert({
        where: { name: allergen },
        update: {},
        create: { name: allergen },
      });
    }
    console.log("✅ Allergens seeded successfully!");
}

// at startup run this to seed the allergens
// seedAllergens().catch((err) => {
//     console.error("❌ Error seeding allergens:", err);
// });
  

// has 105 allerens listed by chat
allergen_route.get('/allergens', async (_, res) => {
    const allergens = await prisma.allergen.findMany();
    res.json(allergens);
})

export default allergen_route;