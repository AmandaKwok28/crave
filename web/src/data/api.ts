import { Cuisine, Difficulty, Price, RecipeType, UserType } from "./types";
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

// Fetch all recipes with query
export const fetchRecipes = async (filters: any): Promise<RecipeType[]> => {
  const filterParams: string[] = [];

  if (filters.mealTypes?.length > 0) {
    filterParams.push(`mealTypes=${filters.mealTypes.join(",")}`);
  }
  if (filters.price) {
    filterParams.push(`price=${filters.price}`);
  }
  if (filters.difficulty) {
    filterParams.push(`difficulty=${filters.difficulty}`);
  }
  if (filters.cuisine?.length > 0) {
    filterParams.push(`cuisine=${filters.cuisine.join(",")}`);
  }
  if (filters.prepTimeMin) {
    filterParams.push(`prepTimeMin=${filters.prepTimeMin}`);
  }
  if (filters.prepTimeMax) {
    filterParams.push(`prepTimeMax=${filters.prepTimeMax}`);
  }
  if (filters.ingredients?.length > 0) {
    filterParams.push(`ingredients=${filters.ingredients.join(",")}`);
  }
  if (filters.allergens?.length > 0) {
    filterParams.push(`allergens=${filters.allergens.join(",")}`);
  }
  if (filters.sources?.length > 0) {
    filterParams.push(`sources=${filters.sources.join(",")}`);
  }
  if (filters.major) {
    filterParams.push(`major=${filters.major}`);
  }


  const queryString = filterParams.length > 0 ? `?${filterParams.join("&")}` : '';
  const response = await fetch(`${API_URL}/feed${queryString}`);
  
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }

  const data: RecipeType[] = await response.json();
  return data;
};

// Fetch all drafts
export const fetchDrafts = async (id:string): Promise<RecipeType[]> => {
  const response = await fetch(`${API_URL}/user/${id}/drafts`, { credentials: 'include' });

  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const data: RecipeType[] = await response.json();
  return data;
  };

// Delete recipe by id
export const deleteRecipe = async (recipe_id: number) : Promise<boolean> => {
const response = await fetch(`${API_URL}/recipe/${recipe_id}`, {
    method: "DELETE",
});
if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
}
return true;
};

// Publish a recipe
export const publishRecipe = async (id:number): Promise<boolean> => {
  const response = await fetch(`${API_URL}/recipe/${id}/publish`, {
    method: "PUT",
    credentials: "include"
  })

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return true;
}

// Create a new recipe
export const createRecipe = async (
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
): Promise<RecipeType> => {

    const response = await fetch(`${API_URL}/recipe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        ingredients,
        instructions,
        description,
        authorId: id,
        mealTypes,
        price,
        cuisine,
        allergens,
        difficulty,
        sources,
        prepTime,
      }),
    });
    console.log(response)
    if (!response.ok) {
      throw new Error(`API request failed! with status: ${response.status}`);
    }
    const data: RecipeType = await response.json();
    return data;
};

// Update a recipe
export const patchRecipe = async (
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
): Promise<RecipeType> => {
    const response = await fetch(`${API_URL}/recipe/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({
        title,
        ingredients,
        instructions,
        description,
        published,
        mealTypes,
        price,
        cuisine,
        allergens,
        difficulty,
        sources,
        prepTime,
      }),
    });
    console.log(response)
    if (!response.ok) {
      throw new Error(`API request failed! with status: ${response.status}`);
    }
    const data: RecipeType = await response.json();
    return data;
};

// Login
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
