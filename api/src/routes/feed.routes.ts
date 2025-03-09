import { Router } from 'express';
import { Cuisine, Difficulty, Price, Prisma } from '@prisma/client';
import { prisma } from '../../prisma/db';

const router = Router();

// Get all published recipes with search
router.get('/', async (req, res) => {
  const { 
    search, 
    skip, 
    take, 
    orderBy,
    mealTypes,
    difficulty,
    price,
    cuisine,
    allergens,
    sources,
    prepTime
  } = req.query

  // Searching
  const or: Prisma.RecipeWhereInput = search
    ? {
        OR: [
          { title: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ],
      }
    : {}

  // Meal Type
  const mealTypesArray = (mealTypes as string)?.split(',');
  const mealTypeFilter: Prisma.RecipeWhereInput = mealTypesArray && mealTypesArray.length > 0
    ? { mealTypes: { hasSome: mealTypesArray } }
    : {};


  // Price
  const priceFilter: Prisma.RecipeWhereInput = price
    ? { price: price as Price }
    : {};

  // Cuisine
  const cuisineFilter: Prisma.RecipeWhereInput = cuisine
    ? { cuisine: cuisine as Cuisine }
    : {};

  // Allergens
  const allergensArray = (allergens as string)?.split(',');
  const allergensFilter: Prisma.RecipeWhereInput = allergensArray && allergensArray.length > 0
    ? { allergens: { hasSome: allergensArray} }
    : {};

  // Difficulty
  const difficultyFilter: Prisma.RecipeWhereInput = difficulty
    ? { difficulty: difficulty as Difficulty }
    : {};

  // Sources
  const sourcesArray = (sources as string)?.split(',');
  const sourcesFilter: Prisma.RecipeWhereInput = sourcesArray && sourcesArray.length > 0
    ? { allergens: { hasSome: sourcesArray} }
    : {};


  // Prep Time (Minutes)
  const prepTimeFilter: Prisma.RecipeWhereInput = prepTime
    ? { prepTime: { equals: Number(prepTime) } }
    : {};

  const recipes = await prisma.recipe.findMany({
    where: {
      published: true,
      ...or,
      ...difficultyFilter,
      ...mealTypeFilter,
      ...cuisineFilter,
      ...allergensFilter,
      ...priceFilter,
      ...sourcesFilter,
      ...prepTimeFilter,
    },
    include: { author: true },
    take: Number(take) || undefined,
    skip: Number(skip) || undefined,
    orderBy: {
      updatedAt: orderBy as Prisma.SortOrder,
    },
  })
  res.json(recipes)
})

export default router;