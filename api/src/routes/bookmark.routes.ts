import { Router } from "express";
import { prisma } from "../../prisma/db";

const router = Router();

// get all bookmarks for a given recipe
router.get('/bookmark', async (req, res) => {
  const { recipeId } = req.body
  const bookmarks = await prisma.bookmark.findMany({
      where: {
        recipeId: recipeId
      }
  })
  res.json(bookmarks)
})

// get all bookmarks for a given user
router.get('/user', async (req, res) => {
  const { userId } = req.body
  const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: userId
      }
  })
  res.json(bookmarks)
})

// Create new bookmark given userId and recipeID
router.post('/', async (req, res) => {
  const { userId, recipeId } = req.body
  const bookmark = await prisma.bookmark.create({
    data: {
        recipeId: recipeId,
        userId: userId
    },
  })
  res.json(bookmark)
});

// Get bookmark by both userId and recipeId
router.get('/both', async (req, res) => {
  const { userId, recipeId } = req.body
    const bookmark = await prisma.bookmark.findUnique({
      where: { 
        bookmarkId: { 
          userId: userId, 
          recipeId: recipeId} 
        },
    })
    res.json(bookmark)
  })

// Delete a bookmark based on both userId and recipeId
router.delete('/both', async (req, res) => {
  const { userId, recipeId } = req.body
    const bookmark = await prisma.bookmark.delete({
      where: { 
        bookmarkId: { 
          userId: userId, 
          recipeId: recipeId} 
        },
    })
    res.json(bookmark)
  })

export default router;
