import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { auth } from './middleware/auth';
import auth_route from './routes/auth';
import recipeRoutes from './routes/recipe.routes'
import userRoutes from './routes/user.routes'
import feedRoutes from './routes/feed.routes'
import likeRoutes from './routes/like.routes';
import allergen_route from './routes/allergens';

const app = express();

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

const server = app.listen(3000, () => {
  console.log(`Listening @ http://localhost:3000`);
});
