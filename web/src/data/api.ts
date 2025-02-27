import { RecipeType, UserType } from "./types";
import { API_URL } from "@/env";
import { API_TEST_URL } from "@/env";

// Fetch all users
export const fetchUsers = async (): Promise<UserType[]> => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
      throw new Error(`API request failed! with status: ${response.status}`);
    }
    const data: UserType[] = await response.json();
    console.log(data);
    return data;
};
 
// Fetch all recipies
export const fetchRecipes = async (): Promise<RecipeType[]> => {
  const response = await fetch(`${API_TEST_URL}/recipes`);
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const data: RecipeType[] = await response.json();
  return data;
};

// Delete recipe by id
export const deleteRecipe = async (recipe_id: number) : Promise<boolean> => {
  const response = await fetch(`${API_TEST_URL}/recipes/${recipe_id}`, {
      method: "DELETE",
  });
  if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
  }
  return true;
};

// Create a new Recipe
export const createRecipe = async (
  title: string, 
  description: string, 
  ingredient_list: string[], 
  instructions: string
): Promise<RecipeType> => {
  const response = await fetch(`${API_TEST_URL}/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      ingredient_list,
      instructions,
      description,
      user_id: 23,
      is_published: true,
    }),
  });
  console.log(response)
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  
  const data: RecipeType = await response.json();
  return data;
};