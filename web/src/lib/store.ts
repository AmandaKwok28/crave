import { AllergenType, CommentType, RecipeType, UserType } from "@/data/types";
import { persistentAtom } from "@nanostores/persistent";
import { atom } from "nanostores";

// User store
export const $user = persistentAtom<UserType>('user', {
  id: '',
  email: '',
  name: '',
  school: '',
  major: ''
}, {
  encode: JSON.stringify,
  decode: JSON.parse
});

export function clearUser() {
  $user.set({
    id: '',
    email: '',
    name: '',
    school: '',
    major: ''
  });
}

export function setUser(user: UserType) {
  $user.set(user);
}

// Recipes store
export const $recipes = persistentAtom<RecipeType[]>('recipes', [], {
  encode: JSON.stringify,
  decode: JSON.parse
});

export function setRecipes(recipes: RecipeType[]) {
    $recipes.set(recipes)
}

export function removeRecipe(recipe_id: number) {
    $recipes.set($recipes.get().filter((recipe) => recipe.id !== recipe_id));
}

export function addRecipe(recipe: RecipeType) {
    $recipes.set([...$recipes.get(), recipe]);
}

// trending store
export const $trendingrecipes = atom<RecipeType[]>([]);
export function setTrendingRecipes(recipes: RecipeType[]) {
  $trendingrecipes.set(recipes);
}
export const $showSearchTrending = atom<Boolean>(false);
export function setShowSearchTrending(val: Boolean) {
  $showSearchTrending.set(val)
}

// Drafts store
export const $drafts = persistentAtom<RecipeType[]>('drafts', [], {
  encode: JSON.stringify,
  decode: JSON.parse
});

export function setDrafts(recipes: RecipeType[]) {
    $drafts.set(recipes)
}

export function addDrafts(recipe: RecipeType) {
    $drafts.set([...$drafts.get(), recipe]);
}

// Likes store
export const $likes = persistentAtom<RecipeType[]>('likes', [], {
  encode: JSON.stringify,
  decode: JSON.parse
});

export function setLikes(recipes: RecipeType[]) {
  $likes.set(recipes)
}

// Bookmarks store
export const $bookmarks = persistentAtom<RecipeType[]>('bookmarks', [], {
  encode: JSON.stringify,
  decode: JSON.parse
});

export function setBookmarks(recipes: RecipeType[]) {
  $bookmarks.set(recipes)
}

// Filters store 
// TODO: Add filters type?

export const $filters = atom({
  mealTypes: [],      // optional
  price: null,        
  difficulty: null,   
  cuisine: [],        
  prepTimeMin: null,  
  prepTimeMax: null,  
  ingredients: [],    
  allergens: [],      
  sources: [],       // optional
  major: null         
})


export function setFilters(updatedFilters: any) { 
  $filters.set({ ...$filters.get(), ...updatedFilters });
}

export function clearFilters() {
  $filters.set({
    mealTypes: [],
    price: null,
    difficulty: null,
    cuisine: [],
    prepTimeMin: null,
    prepTimeMax: null,
    ingredients: [],
    allergens: [],
    sources: [],
    major: null
  });
}


export const $searchTags = atom<string[]>([]);
export function addSearchTags(tag: string) {
  $searchTags.set([...$searchTags.get(), tag]);
}

export function removeSearchTags(tag: string) {
  $searchTags.set($searchTags.get().filter((tags) => tags !== tag));
}

export const $deletedSearchTag = atom<string>("");
export function setDeletedSearchTag(tag: string) {
  $deletedSearchTag.set(tag);
}

// search terms on search page
export const $searchTerm = atom<string>("");
export function setSearchTerm(term: string) {
  $searchTerm.set(term);
}

export const $allergenTable = atom<AllergenType[]>([]);
export function setAllergenTable(allergens: AllergenType[]) {
  $allergenTable.set(allergens);
}

// Comments Store
export const $comments = atom<CommentType[]>([]);

export function setComments(comments: CommentType[]) {
    $comments.set(comments)
}

export function removeComment(commentId: number) {
    $comments.set($comments.get().filter((comment) => comment.id !== commentId));
}

export function addComment(comment: CommentType) {
    $comments.set([...$comments.get(), comment]);
}