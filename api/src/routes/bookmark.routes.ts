import { Router } from "express";
import { prisma } from "../../prisma/db";
import { authGuard } from "../middleware/auth";

const router = Router();

// get all bookmarks for a given user
router.get('/my', authGuard, async (req, res) => {
  const bookmarks = await prisma.recipe.findMany({
    where: {
      bookmarks: {
        some: {
          userId: res.locals.user.id
        }
      }
    },
    include: {
      author: true
    }
  })

  res.json(bookmarks);
});


// bookmark a specific recipe
router.post('/:recipe_id', authGuard, async (req, res) => {
  const { recipe_id } = req.params;

  try {
    await prisma.bookmark.create({
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

// Unbookmark a specific recipe
router.delete('/:recipe_id', authGuard, async (req, res) => {
  const { recipe_id } = req.params;

  try {
    await prisma.bookmark.deleteMany({
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
