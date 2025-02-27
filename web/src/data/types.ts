export interface UserType {
  id: string;
  email: string;
  name: string;
  school: string;
  major: string;
}

export interface RecipeType {
    id: number;
    title: string;
    ingredient_list: string[];
    instructions: string;
    description: string;
    user_id: number;
    is_published: boolean;
}