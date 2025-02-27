import { RecipeType, UserType } from "@/data/types";
import { persistentAtom } from "@nanostores/persistent";
import { atom } from "nanostores";

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

export const $recipes = atom<RecipeType[]>([]);
export function setRecipes(recipes: RecipeType[]) {
    $recipes.set(recipes)
}

export function removeRecipe(recipe_id: number) {
    $recipes.set($recipes.get().filter((recipe) => recipe.id !== recipe_id));
}

export function addRecipe(recipe: RecipeType) {
    $recipes.set([...$recipes.get(), recipe]);
}

export const $NumIngredientsCR = atom(5)
export function setNumIngredientsCR(numIngredients: number) {
    $NumIngredientsCR.set(numIngredients)
}

export const $currIngredientsList = atom<string[]>([]);
export function resetIngredientsList() {
    $currIngredientsList.set([]);
}
export function removeRowsIngredientsList(index: number) {
    $currIngredientsList.set($currIngredientsList.get().slice(0, index));
}
