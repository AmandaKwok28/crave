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
    rating: z.number().min(0)       // would be sad to have less than a 0 rating tbh
});


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
            message: "You have been signed in!",
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
    const rating = res2.data.rating;

    try {

        const user = await prisma.user.findUnique({
            where: { id: id }
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: { rating: rating }
        });

        res.json({
            message: "User rating successfully updated",
            user: updatedUser
        });

        
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user rating' })
    }
})

export default rating_route;