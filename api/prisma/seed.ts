/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password.js';
import generateRecipes from "../src/seed_helpers/recipe_gpt_data.js"


const prisma = new PrismaClient();

enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

enum Price {
  CHEAP = "CHEAP",
  MODERATE = "MODERATE",
  PRICEY = "PRICEY",
  EXPENSIVE = "EXPENSIVE",
}

enum Cuisine {
  ITALIAN = "ITALIAN",
  MEXICAN = "MEXICAN",
  CHINESE = "CHINESE",
  INDIAN = "INDIAN",
  JAPANESE = "JAPANESE",
  FRENCH = "FRENCH",
  MEDITERRANEAN = "MEDITERRANEAN",
  AMERICAN = "AMERICAN",
}

const allergens = [/* your allergen list, unchanged */];

const exampleUser1 = {
  id: '1abc',
  name: 'Gordon Ramsey',
  email: 'ramsey@example.com',
  school: 'Example University',
  major: 'Example Major',
  rating: 0
};

const imagesUrls = [
  "https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2022/09/Tuscan-Chicken-main-1.jpg",
  "https://cdn.shopify.com/s/files/1/0274/9503/9079/files/20220211142754-margherita-9920_5a73220e-4a1a-4d33-b38f-26e98e3cd986.jpg?v=1723650067",
  "https://www.recipetineats.com/tachyon/2017/09/Spinach-Ricotta-Cannelloni-1-2.jpg",
  "https://brunchandbatter.com/wp-content/uploads/2024/08/sicilian-eggplant-caponata-featured.jpg",
  "https://images.food52.com/8vNMdrzM3q57usWI6GR_LQlRmlY=/1200x1200/30135169-2838-4cf5-a6a0-3720bf5d5051--2014-0325_gena_spring-vegan-risotto-028.jpg",
  "https://www.modernhoney.com/wp-content/uploads/2019/03/Italian-Meatball-Subs-4.jpg",
  "https://littlesunnykitchen.com/wp-content/uploads/2020/10/Pesto-Gnocchi-11.jpg",
  
  "https://pinchofyum.com/wp-content/uploads/Chicken-Tinga-Tacos-5.jpg",
  "https://img.hellofresh.com/f_auto,fl_lossy,q_auto,w_1200/hellofresh_s3/image/beef-enchiladas-verdes-5af76252.jpg",
  "https://tryveg.com/wp-content/uploads/2016/01/recetas-chilirelleno.jpg",
  "https://pinchandswirl.com/wp-content/uploads/2021/12/Carne-Asada-Quesadillas-sq.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8L2FtbL2IZ3Wtv9_xsBn7KZfB9J_JG4pSnQ&s",
  "https://cdn.loveandlemons.com/wp-content/uploads/2013/06/corn-salad.jpg",
  "https://somuchfoodblog.com/wp-content/uploads/2024/10/Pork-Pozole-Rojo_LowRes-023.jpg",

  "https://www.noracooks.com/wp-content/uploads/2023/09/kung-pao-tofu-8.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJzN7F3QbMLGA-2WM5qMLrmtxjf2hHRg4QiQ&s",
  "https://www.halfbakedharvest.com/wp-content/uploads/2019/10/Better-Than-Takeout-Dan-Dan-Noodles-1.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQISeure4H3HNvFwxN064HR9k2WlK6g-JVK0Q&s",
  "https://www.rachelphipps.com/wp-content/uploads/2021/05/Hoisin-Duck-Pancake-Wraps.jpg",
  "https://www.simplyrecipes.com/thmb/n02-MNem3dsm3oJs_e5fl2OE4mo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2008__08__shrimp-fried-rice-vertical-a-1600-8cce5b7f8f8b4ac0aec0b635e41aeeac.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ4Kuug7xji0ZCQxTAWKj9Rvfg8tkqQVPDyg&s",

  "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/07/chicken-butter-masala-recipe.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6Bgjo7oRsRtIcKmajXVJZWzUf7Sg3_V3X-Q&s",
  "https://cdn77-s3.lazycatkitchen.com/wp-content/uploads/2023/01/saag-tofu-ready-800x1200.jpg",
  "https://www.allrecipes.com/thmb/Fd6xzEJZWblLiR83vw_5Z20beaY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/ALR-7485811-lamb-rogan-josh-recipe-VAT-4x3-76fc73d4bdc0442d9876fdcd30c0d43c.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5CxVNk2S-6JX2chbCjvppRTrXR7kseB1aLA&s",
  "https://nataliecooks.com/wp-content/uploads/2023/03/DSC04803.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg06-AJMCgnEPxXsRZc6kBkXaCNoqt2HQ2aw&s",

  "https://shuangyskitchensink.com/wp-content/uploads/2020/05/Teriyaki-glazed-Salmon-recipe-photo.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU8QlO9z1bhqkEgIOGBCmbDUDjLuWpdKMD_Q&s",
  "https://beatthebudget.com/wp-content/uploads/2020/07/chicken-katsu-curry-featured-image-scaled.jpg",
  "https://moribyan.com/wp-content/uploads/2023/01/IMG_8680-2-735x1024.jpg",
  "https://www.foodnetwork.com/content/dam/images/food/fullset/2019/5/24/YW1404_Easy-Miso-Ramen_s4x3.jpg",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEituASTKdmcNI2lL3vpbUhdtWff8eOUE-z7JLNm6BdF1FqFJETf27Qx3Jg6W4mVqI8CoaxWQ50pKfUbNozwrGHxJrGlvYygG22SN_qiKlTi_XqXAlIFDapUs3zdlxi-EezL4fWrQfF2CQk/s1600/%E6%97%A5%E5%BC%8F%E8%96%91%E8%93%89%E8%B1%AC%E8%82%89%E7%85%8E%E8%9B%8B%E8%93%8B%E9%A3%AF+Ginger+Pork+and+Fried+Egg+Donburi01.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYh5TzZWX9u5YF_w3gTguzVjBXEX_whW0Tzg&s",

  "https://static01.nyt.com/images/2023/08/24/multimedia/MC-Beef-Bourguignon-lpbv/MC-Beef-Bourguignon-lpbv-mediumSquareAt3X-v4.jpg",
  "https://www.seriouseats.com/thmb/Idf6ZeJluIky_pOoXrqU0hqFD4M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2015__08__20150803-ratatouille-vicky-wasik-8-51fa5e1b3e7f457aaeced2a4da3711aa.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsdbdaMWFwESr29X9fSJPggzVJwwbDaWlCVA&s",
  "https://www.seriouseats.com/thmb/ABI6hunJ3s5IGS0PDCakdj3rrzY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__2018__11__20181023-duck-a-l-orange-vicky-wasik-36-2cbe64627b0246e5a4133c5ec40b276d.jpg",
  "https://spiceandstiletto.com/wp-content/uploads/2021/02/IMG_2056-scaled.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiovxXxXbHfEybJvLKGZI_9BRqq_O7XU3LvQ&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5CqwtnM5GzMobqV7acBafz0DUT7vziBfeYg&s",

  "https://evergreenkitchen.ca/wp-content/uploads/2022/04/Evergreen-Kitchen-Halloumi-Couscous-Salad-1.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS97eI4BhSuzBVd_gMk_J3FNcmxIDqCWPpOkA&s",
  "https://feelgoodfoodie.net/wp-content/uploads/2019/07/Shakshuka-with-Feta-6.jpg",
  "https://mealpractice.b-cdn.net/90248776253575168/mediterranean-grilled-chicken-with-lemon-herb-quinoa-salad-bo8CNnZquO.webp",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQzZszSrbqSiAwhLGDQetJr6vO3ANIrz-2BA&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfy1KhNyP9VMK17MMe4PgDshXFtVFGaq38MQ&s",

  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbPCy3fKDi5ntf2u7xoNfHU9aZHwGnBv0KWg&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXn_DgXviM4Cksf7OJRXkNkV7yVIBHgqtO-w&s",
  "https://feelgoodfoodie.net/wp-content/uploads/2019/01/Cauliflower-Buffalo-Bites-9.jpg",
  "https://www.add1tbsp.com/wp-content/uploads/2016/09/MG_5584.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKhaf8jF1OEyOY9aPvPblx7zvmvAnqdwrYZw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW34LZ4cz1K7ChIEGhOLgVUFQ-ungQg3u5yw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTKB034-YbHiGAtP-9JrtvCLxDiGDVUWjctQ&s"

];

export async function main(n: number = 25) {
  console.log(`Start seeding ...`);

  // Delete existing data
  await prisma.user.deleteMany();
  console.log("Deleted all users");

  const user = await prisma.user.create({
    data: {
      ...exampleUser1,
      passwordHash: await hashPassword('password')
    }
  });
  console.log(`Created user with id: ${user.id}`);

  // Fetch GPT recipes
  const testRecipesTextData = await generateRecipes(n);

  // Seed recipes
  let iter = 0;
  for (const recipeData of testRecipesTextData) {
    const recipe = await prisma.recipe.create({
      data: {
        published: true,
        title: recipeData.title,
        description: recipeData.description,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        mealTypes: recipeData.mealTypes,
        price: recipeData.price as Price,
        cuisine: recipeData.cuisine as Cuisine,
        allergens: recipeData.allergens,
        difficulty: recipeData.difficulty as Difficulty,
        sources: recipeData.sources,
        prepTime: Number(recipeData.prepTime),
        image: imagesUrls[iter]
      }
    });
    iter = iter + 1;
    console.log(`Created recipe with id: ${recipe.id}`);
  }

  // Seed allergens
  for (const allergen of allergens) {
    await prisma.allergen.upsert({
      where: { name: allergen },
      update: {},
      create: { name: allergen },
    });
  }
  console.log("✅ Allergens seeded successfully!");

  console.log(`Seeding finished.`);
  return true;  // success
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
