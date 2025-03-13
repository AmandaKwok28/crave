import { Router } from 'express';
import { prisma } from '../../prisma/db';
import { authGuard } from '../middleware/auth';

const router = Router();

// Create new recipe
router.post('/', async (req, res) => {
    const { title, description, ingredients, instructions, authorId, image } = req.body
    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        ingredients,
        instructions,
        image,
        author: { connect: { id: authorId } },
      },
    })
    res.json(recipe)
});

router.patch('/:id/', authGuard, async (req, res) => {
  const { id } = req.params;
  const { title, description, ingredients, instructions, published, image } = req.body

  const validate = await prisma.recipe.findFirst({ where: { id: Number(id) } });
  if (!validate) {
    res.status(404).json({
      message: 'Could not find recipe'
    });

    return;
  }

  if (validate.authorId !== res.locals.user.id) {
    res.status(401).json({
      message: 'Unauthorized'
    });

    return;
  }

  const recipe = await prisma.recipe.update({
    where: {
      id: Number(id)
    },
    data: {
      title,
      description,
      ingredients,
      instructions,
      published,
      image
    }
  });

  res.json(recipe);
});

// Update recipe views
router.put('/:id/views', async (req, res) => {
    const { id } = req.params
    try {
      const recipe = await prisma.recipe.update({
        where: { id: Number(id) },
        data: { viewCount: { increment: 1 } },
      })
      res.json(recipe)
    } catch (error) {
      res.json({ error: `Recipe with ID ${id} does not exist in the database` })
    }
  })

// Toggle recipe publish status
router.put('/:id/publish', async (req, res) => {
  const { id } = req.params
  try {
    const recipeData = await prisma.recipe.findUnique({
      where: { id: Number(id) },
      select: { published: true },
    })
    const updatedRecipe = await prisma.recipe.update({
      where: { id: Number(id) },
      data: { published: !recipeData?.published },
    })
    res.json(updatedRecipe)
  } catch (error) {
    res.json({ error: `Recipe with ID ${id} does not exist in the database` })
  }
})

// Delete recipe
router.delete('/:recipe_id', async (req, res) => {
  const { recipe_id } = req.params;

  try {
    const recipe = await prisma.recipe.delete({
      where: {
        id: Number(recipe_id),
        authorId: res.locals.user.id
      }
    });
  
    res.json(recipe);  
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error deleting recipe'
    });
  }
})

// Get single recipe
router.get(`/:id`, async (req, res) => {
  const { id } = req.params
  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(id) },
    include: {
      author: true,
      likes: true
    }
  });

  if (!recipe) {
    res.status(404).json({
      message: 'Recipe not found'
    });

    return;
  }

  res.json({
    ...recipe,
    likes: recipe.likes.length,
    liked: !!recipe.likes.find((l) => l.userId === res.locals.user?.id)
  });
})

export default router;