import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma/db';

const router = Router();

// Get all published recipes with search
router.get('/', async (req, res) => {
  const { 
    search, 
    skip, 
    take, 
    orderBy,
    difficulty,
    mealType,
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
  const mealTypeFilter: Prisma.RecipeWhereInput = mealType
    ? { mealType: { hasSome: Array.isArray(mealType) ? mealType : [mealType] } }
    : {};

  // Price
  const priceFilter: Prisma.RecipeWhereInput = price
    ? { price: price as string }
    : {};

  // Cuisine
  const cuisineFilter: Prisma.RecipeWhereInput = cuisine
    ? { cuisine: cuisine as string }
    : {};

  // Allergens
  const allergensFilter: Prisma.RecipeWhereInput = allergens
    ? { allergens: { hasSome: Array.isArray(allergens) ? allergens : [allergens] } }
    : {};

  // Difficulty
  const difficultyFilter: Prisma.RecipeWhereInput = difficulty
    ? { difficulty: difficulty as string }
    : {};

  // Sources
  const sourcesFilter: Prisma.RecipeWhereInput = sources
    ? { sources: { hasSome: Array.isArray(sources) ? sources : [sources] } }
    : {};

  // Prep Time (Minutes)
  const prepTimeFilter: Prisma.RecipeWhereInput = prepTime
    ? {}
    : {};

  const recipes = await prisma.recipe.findMany({
    where: {
      published: true,
      ...or,
      ...difficultyFilter,
      ...mealTypeFilter,
      ...cuisineFilter,
      ...sourcesFilter,
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