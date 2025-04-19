import { Router } from "express";
import { prisma } from "../../prisma/db.js";

const router = Router();

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    res.json(user);

  });
  

export default router;