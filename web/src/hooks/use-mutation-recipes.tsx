import { createRecipe, deleteRecipe, patchRecipe } from "@/data/api";
import { Cuisine, Difficulty, Price } from "@/data/types";
import { addDrafts, addRecipe, removeRecipe } from "@/lib/store";

const useMutationRecipe = () => {

    const deleteRecipeById = async (recipe_id: number) => {
        await deleteRecipe(recipe_id);
        removeRecipe(recipe_id);
    };

    const addNewRecipe = async (
            title: string, 
            description: string, 
            ingredients: string[], 
            instructions: string[], 
            id: string,
            mealTypes: string[],
            price: string,
            cuisine: Cuisine,
            allergens: string[],
            difficulty: string,
            sources: string[],
            prepTime: number
        ) => {
        try {
            if (!title || !description || !ingredients || !instructions ) {
                throw new Error("Title, ingredients, description, and instructions must have content to publish!")
            }
            const recipe = await createRecipe(
                title, 
                description, 
                ingredients, 
                instructions, 
                id,
                mealTypes,
                price,
                cuisine,
                allergens,
                difficulty,
                sources,
                prepTime,
            );
            addRecipe(recipe);
            return recipe.id;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new Error("Error creating new Recipe")
        }
    };

    const addNewRecipeDraft = async (
        title: string, 
        description: string, 
        ingredients: string[], 
        instructions: string[], 
        id: string,
        mealTypes: string[],
        price: Price,
        cuisine: Cuisine,
        allergens: string[],
        difficulty: Difficulty,
        sources: string[],
        prepTime: number
    ) => {
        try {
            if (!title || !description || !ingredients || !instructions ) {
                throw new Error("Title, ingredients, description, and instructions must have content to publish!")
            }
            const recipe = await createRecipe(
                title, 
                description, 
                ingredients, 
                instructions, 
                id,
                mealTypes,
                price,
                cuisine,
                allergens,
                difficulty,
                sources,
                prepTime,
            );
            addDrafts(recipe);
            return recipe.id;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new Error("Error creating new Recipe")
        }
    };

    const editRecipe = async (
        id: number, 
        title: string, 
        description: string, 
        ingredients: string[], 
        instructions: string[], 
        published: boolean,
        mealTypes: string[],
        price: Price,
        cuisine: Cuisine,
        allergens: string[],
        difficulty: Difficulty,
        sources: string[],
        prepTime: number
    ) => {
        if (!id || !title || !description || !ingredients || !instructions ) {
            throw new Error("Title, ingredients, description, and instructions must have content to publish!")
        }

        try {
            if (!title || !description || !ingredients || !instructions ) {
                throw new Error("All field must have content to publish!")
            }
            const recipe = await patchRecipe(
                id, 
                title, 
                description, 
                ingredients, 
                instructions, 
                published,
                mealTypes,
                price,
                cuisine,
                allergens,
                difficulty,
                sources,
                prepTime,
            );
            return recipe.id;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new Error("Error creating new Recipe")
        }
    }

    return {
        deleteRecipeById,
        addNewRecipe,
        addNewRecipeDraft,
        editRecipe
    }
}

export default useMutationRecipe;