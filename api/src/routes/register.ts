import { PrismaClient } from '@prisma/client'
import express from 'express'
import { z } from 'zod';
import { hashPassword } from '../lib/password';

const route = express();

// TODO: Move prismaclient to new file and export it?
const prisma = new PrismaClient()

const registerSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().min(6, 'Passwords must be at least 6 characters long'),
  school: z.string().nonempty(),
  year: z.number().int().gt(2000)
})

route.post('/register', async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      message: result.error.toString()
    });

    return;
  }

  const data = result.data;

  const passwordHash = await hashPassword(data.password);

  const user = prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      passwordHash,
      school: data.school,
      year: data.year
    }
  });

  res.json({
    data: {
      ...data,
      password: undefined
    }
  });
});

export default route;