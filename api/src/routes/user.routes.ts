import { Router } from 'express';
import { prisma } from '../../prisma/db';

const router = Router();

// Get user's unpublished recipes
router.get('/:id/drafts', async (req, res) => {
  const { id } = req.params
  const drafts = await prisma.user
    .findUnique({
      where: { id: id },
    })
    .recipes({
      where: { published: false },
    })
  res.json(drafts)
})

export default router;