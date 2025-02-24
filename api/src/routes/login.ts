import express from 'express'
import { z } from 'zod';
import { verifyPassword } from '../lib/password';
import prisma from '../index'; 


const loginRouter = express.Router();

// do I need to add a unique constraint here?
const loginSchema = z.object({
    email: z.string().email().nonempty(),
    password: z.string().nonempty()
})

loginRouter.post('/login', async (req, res) => {
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
       
        res.json({
            message: "You have been signed in!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
    
})

export default loginRouter;
