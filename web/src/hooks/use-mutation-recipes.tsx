import { createRecipe, deleteRecipe, patchRecipe } from "@/data/api";
import { addDrafts, addRecipe, removeRecipe } from "@/lib/store";

const useMutationRecipe = () => {

    const deleteRecipeById = async (recipe_id: number) => {
        await deleteRecipe(recipe_id);
        removeRecipe(recipe_id);
    };

    const addNewRecipe = async (title: string, description: string, ingredients: string[], instructions: string[], id: string) => {
        try {
            if (!title || !description || !ingredients || !instructions ) {
                throw new Error("All field must have content to publish!")
            }
            const recipe = await createRecipe(title, description, ingredients, instructions, id);
            // console.log(recipe);
            addRecipe(recipe);
            return recipe.id;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new Error("Error creating new Recipe")
        }
    };

    const addNewRecipeDraft = async (title: string, description: string, ingredients: string[], instructions: string[], id: string) => {
        try {
            if (!title || !description || !ingredients || !instructions ) {
                throw new Error("All field must have content to publish!")
            }
            const recipe = await createRecipe(title, description, ingredients, instructions, id);
            addDrafts(recipe);
            return recipe.id;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new Error("Error creating new Recipe")
        }
    };

    const editRecipe = async (id: number, title: string, description: string, ingredients: string[], instructions: string[], published: boolean) => {
        if (!id || !title || !description || !ingredients || !instructions ) {
            throw new Error("All field must have content to publish!");
        }

        try {
            if (!title || !description || !ingredients || !instructions ) {
                throw new Error("All field must have content to publish!")
            }
            const recipe = await patchRecipe(id, title, description, ingredients, instructions, published);
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