import { RecipeType, UserType } from "@/data/types";
import { persistentAtom } from "@nanostores/persistent";

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
