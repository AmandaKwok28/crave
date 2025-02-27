import { atom } from "nanostores";
import { RecipeType, UserType } from "@/data/types";

export const $users = atom<UserType[]>([]);
export function setUsers(users: UserType[]) {
    $users.set(users)
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
