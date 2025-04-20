import dotenv from 'dotenv';

const envFile = `.env.${process.env.NODE_ENV || '.env'}`;
dotenv.config({ path: envFile });


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
import path from 'path';
import { fileURLToPath } from 'url';
import comments_route from './routes/comments.js';
import rating_route from './routes/rating.js';
import pdf_route from './routes/parse-pdf.js';



export const app = express();
const port = Number(process.env.PORT) || 3000;   // app can dynamically listen to port specified by the PORT env var

// app.use(cors({
//   origin: true,
//   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//   allowedHeaders: [
//     'Content-Type',
//     'Authorization'
//   ],
//   exposedHeaders: [ 'Set-Cookie' ],
//   credentials: true
// }));

app.use(cors({
  origin: [
      'http://localhost:3000', // frontend
      'http://localhost:<your-frontend-port>'
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ],
  credentials: true,
  exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());
app.use(cookieParser());
app.use(auth);

app.get('/', (_ , res) => {
  res.status(200).json({
    message: 'Hello Express!'
  })
});

app.use(pdf_route);
app.use(auth_route);
app.use(allergen_route);
app.use(comments_route);    
app.use(rating_route);
app.use('/recipe', recipeRoutes);
app.use('/user', userRoutes);
app.use('/feed', feedRoutes);
app.use('/like', likeRoutes);
app.use('/bookmark', bookmarkRoutes);
app.use('/gpt', gptRoutes);

// Define __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../../../web/dist')));

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../../../web/dist/index.html'));
});

startBackgroundJobs();

app.listen(port, '0.0.0.0', () => {
  console.log(`Listening @ http://localhost:3000`);
});
