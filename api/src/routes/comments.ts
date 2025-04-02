import express from 'express'
import { z } from 'zod';
import { prisma } from '../../prisma/db.js';
import { authGuard } from '../middleware/auth.js';


const comments_route = express.Router();

// validation schemas
const getSchema = z.object({
    recipeId: z.number()
});

const createSchema = z.object({
    id: z.number(),
    content: z.string().nonempty(),
});

const deleteSchema = z.object({
    commentId: z.string(),
    recipeId: z.string()
});

// get
comments_route.get('/:recipeId/comments', async(req, res) => {    // has to take a recipe id since each recipe has many comments

    const result = getSchema.safeParse({ recipeId: parseInt(req.params.recipeId) });
    if (!result.success) {
        res.status(400).json({
            message: "invalid id",
            error: result.error.flatten().fieldErrors
        })

        return;
    }

    const data = result.data;
    const comments = await prisma.comment.findMany({
        where: { recipeId: data.recipeId }, 
    });

    if (!comments) {
        res.status(404).json({ message: "Comments not found" });
    }
  
    res.json(comments);

})

// create
comments_route.post('/:recipeId', async(req, res) => {
    const request = createSchema.safeParse(req.body);
    if (!request.success) {
        res.status(400).json({
            message: "invalid id",
            error: request.error.flatten().fieldErrors
        })

        return;
    }

    const {content, id} = request.data;

    const recipe = await prisma.recipe.findUnique({
        where: { id: id }
    });

    if (!recipe) {
        res.status(404).json({ message: "Recipe not found" });
    }

    // make a new comment
    const comment = await prisma.comment.create({
        data: {
            content,
            recipeId: id  
        }
    });

    res.status(201).json({
        message: "Comment created successfully",
        comment: comment
    });

})


// delete
comments_route.delete('/:recipeId/:commentId', authGuard, async(req, res) => {

    const request = deleteSchema.safeParse(req.params);
    if (!request.success) {
        res.status(400).json({
            message: "invalid id",
            error: request.error.flatten().fieldErrors
        })

        return;
    }

    const { commentId, recipeId } = request.data;

    const recipe = await prisma.recipe.findUnique({
        where: { id: parseInt(recipeId) }
    });

    // make sure recipe exists
    if (!recipe) {
        res.status(404).json({ message: "Recipe not found" });
        return;
    }

    const comment = await prisma.comment.findUnique({
        where: { id: parseInt(commentId) },
        include: { recipe: true } // We also check if the comment is related to the correct recipe
    });

    if (!comment) {
        res.status(404).json({ message: "Comment not found" });
        return;
    }

    if (comment.recipe.id !== parseInt(recipeId)) {
        res.status(400).json({ message: "Comment does not belong to this recipe" });
        return;
    }

    // delete the comment
    await prisma.comment.delete({
        where: { id: parseInt(commentId) }
    });

    res.status(200).json({ 
        message: "Comment deleted successfully", 
        data: comment
    });

})

export default comments_route;