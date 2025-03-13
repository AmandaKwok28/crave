export interface UserType {
  id: string;
  email: string;
  name: string;
  school: string;
  major: string;
}

export enum Price {
  CHEAP = "CHEAP",
  MODERATE = "MODERATE",
  PRICEY = "PRICEY",
  EXPENSIVE = "EXPENSIVE",
}

export enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export enum Cuisine {
  ITALIAN = "ITALIAN",
  MEXICAN = "MEXICAN",
  CHINESE = "CHINESE",
  INDIAN = "INDIAN",
  JAPANESE = "JAPANESE",
  FRENCH = "FRENCH",
  MEDITERRANEAN = "MEDITERRANEAN",
  AMERICAN = "AMERICAN",
}

export interface RecipeType {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string[];
  description: string;
  authorId: string;
  published: boolean;
  likes: number;
  liked: boolean;
  author: AuthorType;
  mealTypes: string[];
  price: Price;
  cuisine: Cuisine;
  allergens: string[];
  difficulty: Difficulty;
  sources: string[];
  prepTime: number;
}

export interface AuthorType {
  id: string;
  email: string;
  name: string;
  school: string;
  major: string;
}

export interface AllergenType {
  id: number;
  name: string;
}

export interface TagsResponse {
  response: {
    price: string;
    cuisine: string;
    difficulty: string;
    prepTime: number;
    ingredients: string[];
    tags: string[];
  }
}