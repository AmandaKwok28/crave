import { createRecipe, deleteRecipe } from "@/data/api";
import { addRecipe, removeRecipe } from "@/lib/store";

const useMutationRecipe = () => {

    const deleteRecipeById = async (recipe_id: number) => {
        await deleteRecipe(recipe_id);
        removeRecipe(recipe_id);
    };

    const addNewRecipe = async (title: string, description: string, ingredient_list: string[], instructions: string) => {
        try {
            if (!title || !description || !ingredient_list || !instructions ) {
                throw new Error("All field must have content to publish!")
            }
            const recipe = await createRecipe(title, description, ingredient_list, instructions);
            addRecipe(recipe);
        } catch (error) {
            throw new Error("Error creating new Recipe")
        }
    };

    return {
        deleteRecipeById,
        addNewRecipe,
    }
}

export default useMutationRecipe;