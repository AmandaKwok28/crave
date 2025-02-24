import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { auth } from './middleware/auth';
import auth_route from './routes/auth';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(auth);

app.use(auth_route);

const server = app.listen(3000, () => {
  console.log(`Listening @ http://localhost:3000`);
});
