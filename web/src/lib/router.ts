import { BASE_URL } from "@/env";
import { createRouter } from "@nanostores/router";

export const $router = createRouter({
  home: `${BASE_URL}`, // home page
  login: `${BASE_URL}login`, // login page
  profile: `${BASE_URL}profile`, // prifle page
  register: `${BASE_URL}register`,
  search: `${BASE_URL}search`,
  createRecipe: `${BASE_URL}create`, // create recipe page
  recipe: `${BASE_URL}recipe/:recipe_id`, // recipie page with specific recipie by id
  editDraft: `${BASE_URL}edit/:draft_id`
});
