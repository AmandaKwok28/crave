import { Router } from "express";
import { prisma } from "../../prisma/db.js";
import { authGuard } from "../middleware/auth.js";

const router = Router();

// Get all likes for the current user
router.get('/my', authGuard, async (req, res) => {
  const likes = await prisma.recipe.findMany({
    where: {
      likes: {
        some: {
          userId: res.locals.user!.id
        }
      }
    },
    include: {
      author: true,
      likes: true,
      bookmarks: true
    }
  });

  if (!likes) {
    res.status(404).json({
      message: 'Likes not found'
    });

    return;
  }

  res.json(likes.map((like) => ({
    ...like,
    likes: like.likes.length,
    liked: !!like.likes.find((l) => l.userId === res.locals.user!.id),
    bookmarks: undefined, // Do not share bookmarks with everyone
    bookmarked: !!like.bookmarks.find((b) => b.userId === res.locals.user!.id)
  })));
});

// Like a specific recipe
router.post('/:recipe_id', authGuard, async (req, res) => {
  const { recipe_id } = req.params;

  try {
    await prisma.like.create({
      data: {
        recipeId: Number(recipe_id),
        userId: res.locals.user!.id
      }
    });  

    const recipeData = await prisma.recipe.findUnique({
      where: { id: Number(recipe_id) }
    })

    const user = await prisma.user.findUnique({
      where: { id: recipeData?.authorId }
    })

    if (!user) {
      res.status(404).json({ message: 'User not found '});
      return;
    }

    // update that user's rating when you like it
    await prisma.user.update({      
      where: { id: user?.id },
      data: {
        rating: user.rating + 1
      }
    })

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
        userId: res.locals.user!.id
      }
    });

    const recipeData = await prisma.recipe.findUnique({
      where: { id: Number(recipe_id) }
    })

    const user = await prisma.user.findUnique({
      where: { id: recipeData?.authorId }
    })

    if (!user) {
      res.status(404).json({ message: 'User not found '});
      return;
    }
    
    // lower the rating if someone unlikes your recipe
    await prisma.user.update({      
      where: { id: user?.id },
      data: {
        rating: user.rating - 1
      }
    })

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