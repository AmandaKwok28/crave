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

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: https://github.com/prisma/prisma-examples/blob/latest/orm/express/README.md#using-the-rest-api`),
)
