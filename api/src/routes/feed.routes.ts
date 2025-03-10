import { Router } from 'express';
import { Cuisine, Difficulty, Price, Prisma } from '@prisma/client';
import { prisma } from '../../prisma/db';

const router = Router();

// Get all published recipes with search
router.get('/', async (req, res) => {
  try {
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
      prepTimeMin,
      prepTimeMax
    } = req.query

    // Validate enum parameters (difficulty, price, cuisine)
    const validateEnum = (value: string, enumType: any) => {
      return Object.values(enumType).includes(value);
    }; 
    if (difficulty && !validateEnum((difficulty as string).toUpperCase(), Difficulty)) {
      throw new Error(`Invalid difficulty value. Valid values are: ${Object.values(Difficulty).join(', ')}`);
    }
    if (price && !validateEnum((price as string).toUpperCase(), Price)) {
      throw new Error(`Invalid price value. Valid values are: ${Object.values(Price).join(', ')}`);
    }
    const cuisineArray = (cuisine as string)?.split(',');
    if (cuisineArray) {
      for (const cuisineItem of cuisineArray) {
        if (!validateEnum(cuisineItem.toUpperCase(), Cuisine)) {
          throw new Error(`Invalid cuisine value: '${cuisineItem}'. Valid values are: ${Object.values(Cuisine).join(', ')}`);
        }
      }
    }
  
    // Searching
    const or: Prisma.RecipeWhereInput = search
      ? {
          OR: [
            { title: { contains: search as string, mode: 'insensitive' } },
            { description: { contains: search as string, mode: 'insensitive' } },
          ],
        }
      : {}
  
    // Meal Type - Multi-Select
    const mealTypesArray = (mealTypes as string)?.split(',');
    const mealTypeFilter: Prisma.RecipeWhereInput = mealTypesArray && mealTypesArray.length > 0
      ? { mealTypes: { hasSome: mealTypesArray } }
      : {};
  
    // Price - Single-Select
    const priceFilter: Prisma.RecipeWhereInput = price
      ? { price: (price as string).toUpperCase() as Price }
      : {};
  
    // Cuisine - Multi-Select
    const cuisineFilter: Prisma.RecipeWhereInput = cuisineArray && cuisineArray.length > 0
      ? { cuisine: { in: cuisineArray.map(c => c.toUpperCase() as Cuisine) } }
      : {};
  
    // Allergens - Multi-Select
    const allergensArray = (allergens as string)?.split(',');
    const allergensFilter: Prisma.RecipeWhereInput = allergensArray && allergensArray.length > 0
      ? { allergens: { hasSome: allergensArray} }
      : {};
  
    // Difficulty - Single-Select // TODO: Make return <= instead of = ?
    const difficultyFilter: Prisma.RecipeWhereInput = difficulty
      ? { difficulty: (difficulty as string).toUpperCase() as Difficulty }
      : {};
  
    // Ingredient Sources - Multi-Select
    const sourcesArray = (sources as string)?.split(',');
    const sourcesFilter: Prisma.RecipeWhereInput = sourcesArray && sourcesArray.length > 0
      ? { allergens: { hasSome: sourcesArray} }
      : {};
  
    // Prep Time (Minutes) - Range Slider
    const prepTimeFilter: Prisma.RecipeWhereInput = {
      prepTime: {
        ...(prepTimeMin ? { gte: Number(prepTimeMin) } : {}),
        ...(prepTimeMax ? { lte: Number(prepTimeMax) } : {}),
      },
    };
  
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
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'An error occurred while fetching recipes' });
  }
  
})

export default router;