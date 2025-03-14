import express from 'express'

const allergen_route = express.Router();

import { prisma } from '../../prisma/db';

// has 105 allerens listed by chat
allergen_route.get('/allergens', async (req, res) => {
    const allergens = await prisma.allergen.findMany();
    res.json(allergens);
})

export default allergen_route;