import { Router } from 'express';
import { prisma } from '../../prisma/db.js';
import { authGuard } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

// Get user's published recipes
router.get('/recipes', authGuard, async (req, res) => {
  const recipes = await prisma.user
    .findUnique({
      where: { id: res.locals.user!.id },
    })
    .recipes({
      where: {
        published: true
      },
      include: {
        author: true
      }
    });
  
  res.json(recipes);
})

// Get user's unpublished recipes
router.get('/drafts', authGuard, async (req, res) => {
  const drafts = await prisma.user
    .findUnique({
      where: { id: res.locals.user!.id },
    })
    .recipes({
      where: {
        published: false
      },
      include: {
        author: true,
        likes: true,
        bookmarks: true
      }
    });
  
  if (!drafts) {
    res.status(404).json({
      message: 'Drafts not found'
    });

    return;
  }
  
  res.json(drafts.map((draft) => ({
    ...draft,
    likes: draft.likes.length,
    liked: !!draft.likes.find((l) => l.userId === res.locals.user!.id),
    bookmarks: undefined, // Do not share bookmarks with everyone
    bookmarked: !!draft.bookmarks.find((b) => b.userId === res.locals.user!.id)
  })));
});

// edit the avatar url
const avatarSchema = z.object({
  email: z.string().nonempty(),
  url: z.string().nonempty(),
})

router.patch('/avatar', async (req, res) => {
  const result = avatarSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      message: 'JSON Body did not fit schema',
      error: result.error.flatten().fieldErrors
    });

    return;
  } 
  const data = result.data;
  try {
    const updatedUser = await prisma.user.update({
      where: { email: data.email },
      // @ts-ignore
      data: { avatarImage: data.url },  // update the avatarImage URL
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server error'
    })
  }
  
})


router.post('/recently-viewed/:id', authGuard, async (req, res) => {
  try {
    const recipeId = parseInt(req.params.id, 10);
    const userId = res.locals.user!.id;
    
    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId }
    });
    
    if (!recipe) {
      res.status(404).json({ message: 'Recipe not found' });
      return;
    }
    
    // Create or update recently viewed entry
    await prisma.recentlyViewed.upsert({
      where: {
        userId_recipeId: { userId, recipeId }
      },
      update: {
        viewedAt: new Date() // Explicitly set the date to force an update
      },
      create: {
        userId,
        recipeId
      }
    });
    
    // Check if user has more than 10 recently viewed items
    const viewedCount = await prisma.recentlyViewed.count({
      where: { userId }
    });

    if (viewedCount > 10) {
      // Find oldest entries to delete (keeping the 10 most recent)
      const oldestEntries = await prisma.recentlyViewed.findMany({
        where: { userId },
        orderBy: { viewedAt: 'asc' },
        take: viewedCount - 10
      });
      
      // Delete the oldest entries
      await prisma.recentlyViewed.deleteMany({
        where: {
          id: {
            in: oldestEntries.map((entry: { id: number }) => entry.id)
          }
        }
      });
    }
    
    res.status(200).json({ message: 'Recently viewed updated successfully' });
    return;
  } catch (error) {
    console.error('Error updating recently viewed:', error);
    res.status(500).json({ message: 'Failed to update recently viewed' });
    return;
  }
});

// Get user's recently viewed recipes
router.get('/recently-viewed', authGuard, async (req, res) => {
  try {
    const userId = res.locals.user!.id;
    
    const recentlyViewed = await prisma.recentlyViewed.findMany({
      where: { userId },
      orderBy: { viewedAt: 'desc' },
      include: {
        recipe: {
          include: {
            author: true
          }
        }
      },
      take: 10 // Limit to most recent 10 items
    });
    
    const recipes = recentlyViewed.map(item => ({
      ...item.recipe,
      viewedAt: item.viewedAt
    }));
    
    res.status(200).json(recipes);
    return;
  } catch (error) {
    console.error('Error fetching recently viewed recipes:', error);
    res.status(500).json({ message: 'Failed to fetch recently viewed recipes' });
    return;
  }
});

// Update the route to use the authenticated user
router.get('/recommended', authGuard, async(req, res) => {
  const userId = res.locals.user!.id; // Get authenticated user's ID
  const limit = parseInt(req.query.limit as string) || 10
  try {
    const recommended = await prisma.recommendedRecipe.findMany({
      where: { userId },
      orderBy: { similarityScore: 'desc' },
      take: limit
    })
    
    const recommendedRecipes = recommended.map(recipe => recipe.recipeId)
    const recipes = await prisma.recipe.findMany({
      where: {
        id: {
          in: recommendedRecipes, // Filter recipes by the recommended recipe IDs
        },
        published: true, // Only return published recipes
      },
      include: {
        author: true,
        likes: true,
        bookmarks: true
      }
    });

    res.json(recipes.map((recipe) => ({
      ...recipe,
      likes: recipe.likes.length,
      likesList: recipe.likes,
      liked: !!recipe.likes.find((l) => l.userId === res.locals.user?.id),
      bookmarks: undefined, // Do not share bookmarks with everyone
      bookmarked: !!recipe.bookmarks.find((b) => b.userId === res.locals.user?.id)
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch similar recipes' })
  }
})

export default router;