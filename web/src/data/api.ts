import { useAuth } from "@/hooks/use-auth";
import { RecipeType, UserType } from "./types";
import { API_URL } from "@/env";

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
const response = await fetch(`${API_URL}/feed`);
if (!response.ok) {
  throw new Error(`API request failed! with status: ${response.status}`);
}
const data: RecipeType[] = await response.json();
return data;
};

// Delete recipe by id
export const deleteRecipe = async (recipe_id: number) : Promise<boolean> => {
const response = await fetch(`${API_URL}/recipes/${recipe_id}`, {
    method: "DELETE",
});
if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
}
return true;
};

// Create a new Recipe
// TODO: Figure out how to get the Author ID of current user
export const createRecipe = async (
  title: string, 
  description: string, 
  ingredients: string[], 
  instructions: string[],
  id: string
): Promise<RecipeType> => {
    const response = await fetch(`${API_URL}/recipe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        ingredients,
        instructions,
        description,
        authorId: id
      }),
    });
    console.log(response)
    if (!response.ok) {
      throw new Error(`API request failed! with status: ${response.status}`);
    }
    const data: RecipeType = await response.json();
    return data;
};

// login
export const login = async ( email: string, password: string ): Promise<UserType> => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password,
    })
  });

  if (!res.ok) {
    // ZodError
    if (res.status === 400) {
      const json = await res.json();
      throw new Error(JSON.stringify(json['error']));
    }

    throw new Error(`Request failed with status ${res.status}`);
  }

  const { data }: { data: UserType } = await res.json();
  return data;
}
