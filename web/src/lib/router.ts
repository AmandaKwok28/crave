import { BASE_URL } from "@/env";
import { createRouter } from "@nanostores/router";

export const $router = createRouter({
  home: `${BASE_URL}`, // home page
  createRecipe: `${BASE_URL}create`, // create recipe page
  recipe: `${BASE_URL}recipe/:recipe_id`, // recipie page with specific recipie by id
});
