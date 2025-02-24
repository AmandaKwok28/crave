import { PrismaClient, Prisma } from '@prisma/client'
import express from 'express'
import loginRouter from './routes/login';
import registerRoute from './routes/register';

const prisma = new PrismaClient()
const app = express()
const cors = require('cors');
app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: 'hello world'
  });
});

app.use('/', loginRouter);
app.use('/', registerRoute);

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: https://github.com/prisma/prisma-examples/blob/latest/orm/express/README.md#using-the-rest-api`),
)

export default prisma;