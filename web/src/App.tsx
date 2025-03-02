import { useStore } from "@nanostores/react";
import { $router } from "./lib/router";
import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Register from "./pages/register";
import Search from "./pages/search";
import { redirectPage } from "@nanostores/router";
import { useEffect } from "react";
import { useAuth } from "./hooks/use-auth";
import CreateRecipe from "./pages/createRecipe";
import ViewRecipe from "./pages/viewRecipe";
import { Flex } from "@chakra-ui/react";

function App() {
  const page = useStore($router);

  const { user, getUser } = useAuth();

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!page) {
    return (
      <div className="flex items-center justify-center">
        404 Not found
      </div>
    )
  }

 // if the user hasn't been set, they shouldn't access pages other than login / register
  if (!user.id) {
    if (page.route === "home" || page.route === "profile") {
      redirectPage($router, "login");
    }
  }

  return (
    <Flex w="100vw">
      {page.route === "home" && (
        <Home/>
      )}
      {page.route === "login" && (
        <Login/>
      )}
      {page.route === "profile" && (
        <Profile/>
      )}
      {page.route === "register" && (
        <Register />
      )}
      {page.route === 'search' && (
        <Search />
      )}
      {page.route === "createRecipe" && (
        <CreateRecipe/>
      )}
      {page.route === "recipe" && (
        <ViewRecipe recipe_id={Number(page.params.recipe_id)}/>
      )}
    </Flex>
  );
}

export default App;