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
  ingredients: string[];
  instructions: string[];
  description: string;
  authorId: number;
  published: boolean;
  author: AuthorType
}

export interface AuthorType {
  id: string;
  email: string;
  name: string;
  school: string;
  major: string;
}