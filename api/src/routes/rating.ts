import express from 'express'
import { z } from 'zod';
import { prisma } from '../../prisma/db.js';


const rating_route = express.Router();

// input validation schemas:
// query params
const idSchema = z.object({
    id: z.string().nonempty()
})

// json body params
const ratingSchema = z.object({
    type: z.enum([
        'like', 
        'bookmark', 
        'comment', 
        'create', 
        'unlike', 
        'unbookmark', 
        'uncomment', 
        'delete'
    ])
});


const ratingDelta: Record<string, number> = {
    like: 1,
    bookmark: 1,
    comment: 1,
    create: 5,
    unlike: -1,
    unbookmark: -1,
    uncomment: -1,
    delete: -5
  };
  


// allow fetching the rating
rating_route.get('/:id/rating', async(req, res) => {

    const res1 = idSchema.safeParse(req.params);
    if (!res1.success) {
        res.status(400).json({
          message: 'URL Param did not fit schema',
          error: res1.error.flatten().fieldErrors
        });
  
        return;
    }
    const id = res1.data.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: id }
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({
            message: "Success!",
            rating: user.rating
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user rating' })
    }
})


// allow updating the rating
rating_route.put('/:id/rating', async(req, res) => {

    const res1 = idSchema.safeParse(req.params);
    const res2 = ratingSchema.safeParse(req.body);

    if (!res1.success) {
        res.status(400).json({
          message: 'URL Param did not fit schema',
          error: res1.error.flatten().fieldErrors
        });
  
        return;
    }

    if (!res2.success) {
        res.status(400).json({
          message: 'JSON Body did not fit schema',
          error: res2.error.flatten().fieldErrors
        });
  
        return;
    }

    const id = res1.data.id;
    const { type } = res2.data;

    try {

        const user = await prisma.user.findUnique({
            where: { id: id }
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // if the type was create recipe, you get 5 points, otherwise it's 1
        const delta = ratingDelta[type];
        const newRating = user.rating + delta;
        
        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: { rating: newRating }
        });

        res.json({
            message: "User rating successfully updated",
            user: {
                ...updatedUser,
                passwordHash: undefined
            }
        });

        
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user rating' })
    }
})

export default rating_route;