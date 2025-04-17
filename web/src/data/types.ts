export interface UserType {
  id: string;
  email: string;
  name: string;
  school: string;
  major: string;
  avatarImage?: string;
  rating: Number
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
  likesList: LikeType[];
  likes: number;
  liked: boolean;
  bookmarked: boolean;
  author: AuthorType;
  mealTypes: string[];
  price: Price;
  cuisine: Cuisine;
  allergens: string[];
  difficulty: Difficulty;
  sources: string[];
  prepTime: number;
  image?: string;
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
    mealTypes: string[]
  }
}

export interface CommentType {
  id: number;
  createdAt: string;
  recipeId: number;
  author: AuthorType;
  content: string;
};

export interface LikeType {
  id: number;
  recipeId: number;
  userId: string;
  date: string;
}