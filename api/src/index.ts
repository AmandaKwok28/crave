import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { auth } from './middleware/auth';
import auth_route from './routes/auth';
import recipeRoutes from './routes/recipe.routes'
import userRoutes from './routes/user.routes'
import feedRoutes from './routes/feed.routes'
import { startBackgroundJobs } from './services/scheduler';
import path from 'path';

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
app.use('/recipe', recipeRoutes);
app.use('/user', userRoutes);
app.use('/feed', feedRoutes);

// Add these lines after your API routes
// Serve static files from the React/Vue build directory
app.use(express.static(path.join(__dirname, '../../../web/dist')));

// For any route not found in API, serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../web/dist/index.html'));
});

startBackgroundJobs();

const server = app.listen(3000, () => {
  console.log(`Listening @ http://localhost:3000`);
});
