import { Router } from "express";
import { prisma } from "../../prisma/db";
import { authGuard } from "../middleware/auth";

const router = Router();

// Get all likes for the current user
router.get('/my', authGuard, async (req, res) => {
  const likes = await prisma.like.findMany({
    where: {
      userId: res.locals.user.id
    }
  });

  res.json(likes);
})

// Like a specific recipe
router.post('/:recipe_id', authGuard, async (req, res) => {
  const { recipe_id } = req.params;

  try {
    await prisma.like.create({
      data: {
        recipeId: Number(recipe_id),
        userId: res.locals.user.id
      }
    });  

    res.json({
      success: true
    });
  } catch (error) {
    res.status(500).json({
      success: false
    })
  }
});

// Unlike a specific recipe
router.delete('/:recipe_id', authGuard, async (req, res) => {
  const { recipe_id } = req.params;

  try {
    await prisma.like.deleteMany({
      where: {
        recipeId: Number(recipe_id),
        userId: res.locals.user.id
      }
    });
    
    res.json({
      success: true
    });
  } catch (error) {
    res.status(500).json({
      success: false
    })
  }
});

export default router;