import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { auth } from './middleware/auth.js';
import auth_route from './routes/auth.js';
import recipeRoutes from './routes/recipe.routes.js'
import userRoutes from './routes/user.routes.js'
import feedRoutes from './routes/feed.routes.js'
import likeRoutes from './routes/like.routes.js';
import bookmarkRoutes from './routes/bookmark.routes.js';
import gptRoutes from './routes/gpt.routes.js';
import allergen_route from './routes/allergens.js';
import { startBackgroundJobs } from './services/scheduler.js';

export const app = express();

app.use(cors({
  origin: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ],
  exposedHeaders: [ 'Set-Cookie' ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(auth);

app.use(auth_route);
app.use(allergen_route);
app.use('/recipe', recipeRoutes);
app.use('/user', userRoutes);
app.use('/feed', feedRoutes);
app.use('/like', likeRoutes);
app.use('/bookmark', bookmarkRoutes);
app.use('/gpt', gptRoutes);

const port = process.env.API_PORT ?? 3000;
app.listen(port, () => {
  console.log(`Listening @ http://localhost:3000`);
});

startBackgroundJobs();
