import { Router } from "express";
import { prisma } from "../../prisma/db.js";

const router = Router();

// TODO: Fix: User can follow/unfollow themselves
// TODO: Fix: User can follow people multiple times

// Get user by id (for profile)
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

  // Follow a user
  router.post('/:userId/follow', async (req, res) => {
    const { userId } = req.params;
    const { followerId } = req.body;

    if (!followerId) {
      res.status(400).json({ error: "Missing followerId" });
    }
    if (userId === followerId) {
      res.status(400).json({ error: "Users cannot follow themselves" });
    }

    try {
      await prisma.follow.create({
        data: {
          followerId,
          followingId: userId,
        }
      });

      res.status(200).json({ message: `User ${followerId} is now following ${userId}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Could not follow user" });
    }
});

// Unfollow a user
router.delete('/:userId/unfollow', async (req, res) => {
  const { userId } = req.params;
  const { followerId } = req.body;

  if (!followerId) {
    res.status(400).json({ error: "Missing followerId" });
  }

  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userId,
        }
      }
    });

    res.status(200).json({ message: `User ${followerId} unfollowed ${userId}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not unfollow user" });
  }
});

// Get followers of a user
router.get('/:userId/followers', async (req, res) => {
  const { userId } = req.params;

  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: { follower: true }
    });

    res.status(200).json(followers.map(f => f.follower));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch followers" });
  }
});

// Get following list of a user
router.get('/:userId/following', async (req, res) => {
  const { userId } = req.params;

  try {
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: { following: true }
    });

    res.status(200).json(following.map(f => f.following));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch following list" });
  }
});


  

export default router;