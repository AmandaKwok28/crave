import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
import recipeRoutes from './routes/recipe.routes'
import userRoutes from './routes/user.routes'
import feedRoutes from './routes/feed.routes'

const prisma = new PrismaClient()
const app = express()
const cors = require('cors');
app.use(cors())
app.use(express.json())

app.use('/recipe', recipeRoutes)
app.use('/user', userRoutes)
app.use('/feed', feedRoutes)

app.post(`/signup`, async (req, res) => {
  const { name, email } = req.body

  try {
    const result = await prisma.user.create({
      data: {
        name,
        email,
      },
    })
    res.json(result)
  } catch (error) {
    res.json({ error: 'Failed to create user' })
  }
})

// Create new recipe
app.post(`/recipe`, async (req, res) => {
  const { title, description, ingredients, instructions, authorId, image } = req.body
  const result = await prisma.recipe.create({
    data: {
      title,
      description,
      ingredients,
      instructions,
      image,
      author: { connect: { id: Number(authorId) } },
    },
  })
  res.json(result)
})

// Update recipe views
app.put('/recipe/:id/views', async (req, res) => {
  const { id } = req.params
  try {
    const recipe = await prisma.recipe.update({
      where: { id: Number(id) },
      data: { viewCount: { increment: 1 } },
    })
    res.json(recipe)
  } catch (error) {
    res.json({ error: `Recipe with ID ${id} does not exist in the database` })
  }
})

// Toggle recipe publish status
app.put('/recipe/:id/publish', async (req, res) => {
  const { id } = req.params
  try {
    const recipeData = await prisma.recipe.findUnique({
      where: { id: Number(id) },
      select: { published: true },
    })
    const updatedRecipe = await prisma.recipe.update({
      where: { id: Number(id) },
      data: { published: !recipeData?.published },
    })
    res.json(updatedRecipe)
  } catch (error) {
    res.json({ error: `Recipe with ID ${id} does not exist in the database` })
  }
})

// Delete recipe
app.delete(`/recipe/:id`, async (req, res) => {
  const { id } = req.params
  const recipe = await prisma.recipe.delete({
    where: { id: Number(id) },
  })
  res.json(recipe)
})

// Get user's unpublished recipes
app.get('/user/:id/drafts', async (req, res) => {
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

// Get single recipe
app.get(`/recipe/:id`, async (req, res) => {
  const { id } = req.params
  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(id) },
    include: { author: true }
  })
  res.json(recipe)
})

// Get all published recipes with search
app.get('/feed', async (req, res) => {
  const { searchString, skip, take, orderBy } = req.query

  const or: Prisma.RecipeWhereInput = searchString
    ? {
        OR: [
          { title: { contains: searchString as string } },
          { description: { contains: searchString as string } },
        ],
      }
    : {}

  const recipes = await prisma.recipe.findMany({
    where: {
      published: true,
      ...or,
    },
    include: { author: true },
    take: Number(take) || undefined,
    skip: Number(skip) || undefined,
    orderBy: {
      updatedAt: orderBy as Prisma.SortOrder,
    },
  })
  res.json(recipes)
})

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: https://github.com/prisma/prisma-examples/blob/latest/orm/express/README.md#using-the-rest-api`),
)
