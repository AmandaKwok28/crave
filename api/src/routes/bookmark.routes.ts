import { Router } from "express";
import { prisma } from "../../prisma/db.js";
import { authGuard } from "../middleware/auth.js";

const router = Router();

// get all bookmarks for a given user
router.get('/my', authGuard, async (req, res) => {
  const bookmarks = await prisma.recipe.findMany({
    where: {
      bookmarks: {
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

  if (!bookmarks) {
    res.status(404).json({
      message: 'Bookmarks not found'
    });

    return;
  }

  res.json(bookmarks.map((bookmark) => ({
    ...bookmark,
    likes: bookmark.likes.length,
    liked: !!bookmark.likes.find((l) => l.userId === res.locals.user!.id),
    bookmarks: undefined, // Do not share bookmarks with everyone
    bookmarked: !!bookmark.bookmarks.find((b) => b.userId === res.locals.user!.id)
  })));
});


// bookmark a specific recipe
router.post('/:recipe_id', authGuard, async (req, res) => {
  const { recipe_id } = req.params;

  try {
    await prisma.bookmark.create({
      data: {
        recipeId: Number(recipe_id),
        userId: res.locals.user!.id
      }
    });  

    const recipe = await prisma.recipe.findUnique({
      where: { id: Number(recipe_id)}
    })

    if (!recipe) {
      res.status(404).json('Recipe not found');
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: recipe.authorId }
    })

    if (!user) {
      res.status(500).json('User not found')
      return;
    }

    // add a score for making a bookmark!
    await prisma.user.update({      
      where: { id: user.id },
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

// Unbookmark a specific recipe
router.delete('/:recipe_id', authGuard, async (req, res) => {
  const { recipe_id } = req.params;

  try {
    await prisma.bookmark.deleteMany({
      where: {
        recipeId: Number(recipe_id),
        userId: res.locals.user!.id
      }
    });

    const recipe = await prisma.recipe.findUnique({
      where: { id: Number(recipe_id)}
    })

    if (!recipe) {
      res.status(404).json('Recipe not found');
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: recipe.authorId }
    })

    if (!user) {
      res.status(500).json('User not found')
      return;
    }

    // minus score for removing a bookmark
    await prisma.user.update({      
      where: { id: user.id },
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
