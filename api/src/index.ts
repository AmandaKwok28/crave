import express from 'express';
import cors from 'cors';
import { prisma } from '../prisma/db';
import cookieParser from 'cookie-parser';
import { auth } from './middleware/auth';
import auth_route from './routes/auth';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(auth);

app.use(auth_route);


const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: https://github.com/prisma/prisma-examples/blob/latest/orm/express/README.md#using-the-rest-api`),
)

export default prisma;