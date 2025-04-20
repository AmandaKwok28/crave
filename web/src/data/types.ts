export interface UserType {
  id: string;
  email: string;
  name: string;
  school: string;
  major: string;
  avatarImage?: string;
}

export enum PartyStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
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

export interface PartyType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: PartyStatus;
  shareLink: string;
  ExpiresAt: string;
  hostId: string;
  host: AuthorType;
  isUserMember: Boolean;
  isHost: Boolean;
  members: PartyMemberType[];
  prefrences: PartyPrefrenceType;
  recomendations: PartyRecommendationType[];
}

export interface PartyMemberType {
  id: number;
  partyId: string;
  userId: string;
  user: AuthorType;
  joinedAt: string;
  hasAccepted: Boolean;
  ingredients: string[];
  cookingAbility: Difficulty;
}

export interface PartyPrefrenceType {
  id: number;
  partyId: string;
  availableTime: number;
  preferredCuisines: Cuisine[];
  preferredPrice: Price;
  aggregatedIngredients: string[];
  excludedAllergens: string[];
  preferredDifficulty: Difficulty;
  createdAt: string;
  updatedAt: string;
}

export interface PartyRecommendationType {
  id: number;
  partyId: string;
  recipeID: number;
  matchScore: number;
  createdAt: string;
}

