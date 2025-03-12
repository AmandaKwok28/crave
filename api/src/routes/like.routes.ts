import { Router } from "express";
import { prisma } from "../../prisma/db";

const router = Router();

// get all likes for a given recipe
router.get('/recipe', async (req, res) => {
  const { recipeId } = req.body
  const like = await prisma.like.findMany({
      where: {
        recipeId: recipeId
      }
  })
  res.json(like)
})

// get all likes for a given user
router.get('/user', async (req, res) => {
  const { userId } = req.body
  const like = await prisma.like.findMany({
      where: {
        userId: userId
      }
  })
  res.json(like)
})

// Create new like given userId and recipeID
router.post('/', async (req, res) => {
  const { userId, recipeId } = req.body
  const like = await prisma.like.create({
    data: {
        recipeId: recipeId,
        userId: userId
    },
  })
  res.json(like)
});

// Get like by both userId and recipeId
router.get('/both', async (req, res) => {
  const { userId, recipeId } = req.body
    const like = await prisma.like.findUnique({
      where: { 
        likeId: { 
          userId: userId, 
          recipeId: recipeId} 
        },
    })
    res.json(like)
  })

// Delete a like based on both userId and recipeId
router.delete('/both', async (req, res) => {
  const { userId, recipeId } = req.body
    const like = await prisma.like.delete({
      where: { 
        likeId: { 
          userId: userId, 
          recipeId: recipeId} 
        },
    })
    res.json(like)
  })

export default router;