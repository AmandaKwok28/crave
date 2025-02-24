export interface UserType {
    id: number;
    email: string;
    name: string;
}

export interface Recipe {
    recipe_id: number;
    title: string;
    ingredient_list: string[];
    instructions: string;
    description: string;
    user_id: number;
    is_published: boolean;
}