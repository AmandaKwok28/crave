import { Router } from 'express';
import { prisma } from '../../prisma/db.js';
import { authGuard } from '../middleware/auth.js';

const router = Router();



// Create a recipe
router.post('/', async (req, res) => {
  const { 
    title, 
    description, 
    ingredients, 
    instructions, 
    authorId, 
    image, 
    mealTypes, 
    difficulty, 
    price, 
    cuisine, 
    allergens, 
    sources, 
    prepTime 
  } = req.body;

  try {
    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        ingredients,
        instructions,
        image,
        author: { connect: { id: authorId } },
        mealTypes: mealTypes || [],
        difficulty: difficulty ? difficulty.toUpperCase() : null,
        price: price ? price.toUpperCase() : null,
        cuisine: cuisine ? cuisine.toUpperCase() : null,  // need to change the schema
        allergens: allergens || [],
        sources: sources || [],
        prepTime: prepTime || null,
      },
    });

    res.json(recipe);
  } catch(error) {
    console.log(error);
    res.status(500).json({
      message: 'An unknown error occurred'
    })
  }
});

// Update a recipe
router.patch('/:id/', authGuard, async (req, res) => {
  const { id } = req.params;
  const { 
    title, 
    description, 
    ingredients, 
    instructions, 
    published,
    image,
    mealTypes,
    difficulty,
    price,
    cuisine,
    allergens,
    sources,
    prepTime
  } = req.body;

  const validate = await prisma.recipe.findFirst({ where: { id: Number(id) } });
  if (!validate) {
    res.status(404).json({
      message: 'Could not find recipe'
    });

    return;
  }

  if (validate.authorId !== res.locals.user!.id) {
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
      image,
      mealTypes,
      difficulty,
      price,
      cuisine,
      allergens,
      sources,
      prepTime
    }
  });

  res.json(recipe);
});

// Get similar recipes
router.get('/:id/similar', async (req, res) => {
  const { id } = req.params
  const limit = parseInt(req.query.limit as string) || 3
  
  try {
    const similarities = await prisma.recipeSimilarity.findMany({
      where: { baseRecipeId: Number(id) },
      orderBy: { similarityScore: 'desc' },
      take: limit,
      include: { 
        similarRecipe: {
          include: {
            author: true
          }
        } 
      }
    })
    
    // Map to just the similar recipes
    const similarRecipes = similarities.map(sim => sim.similarRecipe)
    res.json(similarRecipes)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch similar recipes' })
  }
})

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
      where: { id: Number(id) }
    })

    if (!recipeData) {
      res.status(404).json({ message: `Recipe with ID ${id} not found` });
      return;
    }

    const updatedRecipe = await prisma.recipe.update({
      where: { id: Number(id) },
      data: { published: !recipeData.published },
    })

    const user = await prisma.user.findUnique({
      where: { id: recipeData.authorId }
    });

    if (!user) {
      res.status(500).json({
        message: "Could not create recipe, error fetching user"
      })
      return;
    }

    await prisma.user.update({
      where: { id: recipeData.authorId },
      data: { rating: user.rating + 5 }   // if you create a recipe you get +5 points (only if it's published though)
    });

    res.json(updatedRecipe)
  } catch (error) {
    res.status(500).json({ error: `Recipe with ID ${id} does not exist in the database` })
  }
})

// Delete recipe
router.delete('/:recipe_id', async (req, res) => {
  const { recipe_id } = req.params;

  if (!res.locals.user) {
    res.status(500).json({
      message: 'Error deleting recipe'
    });
    
    return;
  }

  try {
    const recipe = await prisma.recipe.delete({
      where: {
        id: Number(recipe_id),
        authorId: res.locals.user.id
      }
    });

    // if you're deleting a published recipe, lower your rating (deal with case where that recipe has likes and stuff...)
    if (recipe.published) {
      const user = await prisma.user.findUnique({
        where: { id: recipe.authorId }
      });
  
      if (!user) {
        res.status(500).json({
          message: "Could not create recipe, error fetching user"
        })
        return;
      }
  
      await prisma.user.update({
        where: { id: recipe.authorId },
        data: { rating: user.rating - 5 }  
      });
    }

  
    res.json(recipe);  
  } catch (error) {
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
      likes: true,
      bookmarks: true
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
    likesList: recipe.likes,
    liked: !!recipe.likes.find((l) => l.userId === res.locals.user?.id),
    bookmarks: undefined, // Do not share bookmarks with everyone
    bookmarked: !!recipe.bookmarks.find((b) => b.userId === res.locals.user?.id)
  });
})

export default router;