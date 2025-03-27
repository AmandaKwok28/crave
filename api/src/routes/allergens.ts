import express from 'express'
import { prisma } from '../../prisma/db.js';

const allergen_route = express.Router();

// has 105 allerens listed by chat
allergen_route.get('/allergens', async (req, res) => {
    const allergens = await prisma.allergen.findMany();
    res.json(allergens);
})

export default allergen_route;