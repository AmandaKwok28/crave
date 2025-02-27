import { BASE_URL } from "@/env";
import { createRouter } from "@nanostores/router";

export const $router = createRouter({
  home: `${BASE_URL}`, // home page
  login: `${BASE_URL}login`, // login page
  profile: `${BASE_URL}profile`, // prifle page
  register: `${BASE_URL}register`,
  search: `${BASE_URL}search`
});