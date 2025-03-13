import { Router } from "express";
import { prisma } from "../../prisma/db";
import { authGuard } from "../middleware/auth";

const router = Router();

// get whether or not the current user has bookmarked a specific reipe
router.get('/recipe/:recipe_id', authGuard, async (req, res) => {
  const { recipe_id } = req.params;

  const bookmark = await prisma.bookmark.findFirst({
    where: {
      recipeId: Number(recipe_id),
      userId: res.locals.user.id
    }
  });

  res.json({
    bookmarked: !!bookmark
  });
});

// get all bookmarks for a given user
router.get('/user/:user_id', async (req, res) => {
  const { user_id } = req.params;

  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId: user_id
    }
  });

  res.json(bookmarks);
})

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
