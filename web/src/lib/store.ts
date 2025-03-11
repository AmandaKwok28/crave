import { RecipeType, UserType } from "@/data/types";
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

// Filters store 
// TODO: Add filters type?

export const $filters = atom({
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