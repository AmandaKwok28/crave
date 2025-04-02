import express from 'express'
import { z } from 'zod';
import { prisma } from '../../prisma/db.js';


const comments_route = express.Router();

// validation schemas
const getSchema = z.object({
    id: z.number()
});

// get
comments_route.get('/:recipeId/comments', async(req, res) => {    // has to take a recipe id since each recipe has many comments

    const result = getSchema.safeParse(req);
    if (!result.success) {
        res.status(400).json({
            message: "invalid id",
            error: result.error.flatten().fieldErrors
        })

        return;
    }

    const data = result.data;
    const comments = await prisma.comment.findMany({
        where: { recipeId: parseInt(data.id) }, 
        include: { author: true }, // Include author details if needed
    });
  
    res.json(comments);

})

// create
// delete

export default comments_route;