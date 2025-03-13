import { Router } from 'express';
import { prisma } from '../../prisma/db';
import { authGuard } from '../middleware/auth';

const router = Router();

// Get user's published recipes
router.get('/:id/recipes', authGuard, async (req, res) => {
  const { id } = req.params

  const recipes = await prisma.user
    .findUnique({
      where: { id: id },
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
router.get('/:id/drafts', authGuard, async (req, res) => {
  const { id } = req.params

  const drafts = await prisma.user
    .findUnique({
      where: { id: id },
    })
    .recipes({
      where: {
        published: false
      },
      include: {
        author: true
      }
    })
  
  res.json(drafts);
});

export default router;