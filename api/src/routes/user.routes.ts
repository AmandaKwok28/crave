import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Create new user
router.post(`/signup`, async (req, res) => {
    const { name, email } = req.body
  
    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
        },
      })
      res.json(user)
    } catch (error) {
      res.json({ error: 'Failed to create user' })
    }
  })

// Get user's unpublished recipes
router.get('/:id/drafts', async (req, res) => {
  const { id } = req.params
  const drafts = await prisma.user
    .findUnique({
      where: { id: Number(id) },
    })
    .recipes({
      where: { published: false },
    })
  res.json(drafts)
})

export default router;