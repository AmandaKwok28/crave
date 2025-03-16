import { Router } from 'express';
import { prisma } from '../../prisma/db';
import { authGuard } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

// Get user's published recipes
router.get('/recipes', authGuard, async (req, res) => {
  const recipes = await prisma.user
    .findUnique({
      where: { id: res.locals.user.id },
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
      where: { id: res.locals.user.id },
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
    liked: !!draft.likes.find((l) => l.userId === res.locals.user?.id),
    bookmarks: undefined, // Do not share bookmarks with everyone
    bookmarked: !!draft.bookmarks.find((b) => b.userId === res.locals.user?.id)
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
      data: { avatarImage: data.url },  // update the avatarImage URL
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server error'
    })
  }
  
})

export default router;