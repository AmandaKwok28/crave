import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

// Create new like
router.post('/', async (req, res) => {
    const { userId, recipeId } = req.body
    const like = await prisma.like.create({
      data: {
        recipe: { connect: { id: recipeId } },
        user: { connect: { id: userId } },
      },
    })
    res.json(like)
});

// Get single like
router.get(`/:id`, async (req, res) => {
  const { id } = req.params
  const like = await prisma.like.findUnique({
    where: { id: Number(id) }
  })
  res.json(like)
})

export default router;