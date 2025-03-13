import { Router } from "express";
import { prisma } from "../../prisma/db";
import { authGuard } from "../middleware/auth";

const router = Router();

// get whether or not the current user has liked a specific reipe
router.get('/recipe/:recipe_id', authGuard, async (req, res) => {
  const { recipe_id } = req.params;

  const like = await prisma.like.findFirst({
    where: {
      recipeId: Number(recipe_id),
      userId: res.locals.user.id
    }
  });

  res.json({
    liked: !!like
  });
});

// get all likes for a given user
router.get('/user/:user_id', async (req, res) => {
  const { user_id } = req.params;

  const like = await prisma.like.findMany({
    where: {
      userId: user_id
    }
  });

  res.json(like);
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