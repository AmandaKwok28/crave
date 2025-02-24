import { Router } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all published recipes with search
router.get('/', async (req, res) => {
  const { searchString, skip, take, orderBy } = req.query

  const or: Prisma.RecipeWhereInput = searchString
    ? {
        OR: [
          { title: { contains: searchString as string } },
          { description: { contains: searchString as string } },
        ],
      }
    : {}

  const recipes = await prisma.recipe.findMany({
    where: {
      published: true,
      ...or,
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