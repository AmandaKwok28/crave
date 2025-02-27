import express from 'express'
import { z } from 'zod';
import { hashPassword, verifyPassword } from '../lib/password';
import { prisma } from '../../prisma/db';
import { createSession, deleteSessionTokenCookie, generateSessionToken, setSessionTokenCookie, validateSessionToken } from '../lib/session';
import { authGuard } from '../middleware/auth';
import { User } from '@prisma/client';

const auth_route = express.Router();

const registerSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().min(6, 'Passwords must be at least 6 characters long'),
  school: z.string().nonempty(),
  major: z.string().nonempty()
})

const loginSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().nonempty()
})


auth_route.post('/login', async (req, res) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
        message: result.error.toString()
        });
        return;
    }

    const data = result.data;

    try {
        const user = await prisma.user.findUnique({
            where: {
              email: data.email, 
            }
        });


        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const validPassword = await verifyPassword(data.password, user.passwordHash)

        if (!validPassword) {
            res.status(401).json({ message: 'Incorrect Password' });
        }

        const token = generateSessionToken();
        const session = await createSession(token, user.id); 
        setSessionTokenCookie(res, token, session.expiresAt);
       
        res.json({
            message: "You have been signed in!",
            data: {
              ...user,
              passwordHash: undefined
            }
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
    
})

auth_route.post('/register', async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      message: 'JSON Body did not fit schema',
      error: result.error
    });

    return;
  }

  const data = result.data;

  const passwordHash = await hashPassword(data.password);

  let user: User | null = null;

  try {
    user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
        school: data.school,
        major: data.major
      }
    });  

    if (!user) {
      throw new Error();
    }
  } catch (error) {
    res.status(400).json({
      message: 'Could not register new user'
    });

    return;
  }

  const token = generateSessionToken();
  const session = await createSession(token, user.id); 
  setSessionTokenCookie(res, token, session.expiresAt);

  res.json({
    data: {
      ...user,
      passwordHash: undefined
    }
  });
});

auth_route.post('/logout', authGuard, async (req, res) => {
  deleteSessionTokenCookie(res);

  res.json({
    message: 'Successfully logged out'
  })
});

auth_route.get('/get-user', authGuard, async (req, res) => {
  const token = req.cookies['session'];
  const { user } = await validateSessionToken(token);

  res.json({
    data: {
      ...user,
      passwordHash: undefined
    }
  });
});

auth_route.get('/validate-session', authGuard, async (req, res) => {
  res.json({
    message: 'Successfully authenticated'
  });
});

export default auth_route;