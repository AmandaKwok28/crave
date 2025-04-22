import { useStore } from "@nanostores/react";
import { $router } from "./lib/router";
import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Register from "./pages/register";
import Search from "./pages/search";
import { redirectPage } from "@nanostores/router";
import { useAuth } from "./hooks/use-auth";
import ViewRecipe from "./pages/viewRecipe";
import { Flex } from "@chakra-ui/react";
import RecipeForm from "./pages/recipeForm";
import ViewParty from "./pages/partyPages/viewParty";
import HostPrefrencesForm from "./pages/partyPages/hostPrefrencesForm";
import { useEffect } from "react";
import { setIsMobile } from "./lib/store";

function App() {
  const page = useStore($router);
  
  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
        <Profile userId={page.params.userId}/>
      )}
      {page.route === "register" && (
        <Register />
      )}
      {page.route === 'search' && (
        <Search />
      )}
      {page.route === "createRecipe" && (
        <RecipeForm />
      )}
      {page.route === "party" && (
        <ViewParty share_link={String(page.params.share_link)} />
      )}
      {page.route === "createParty" && (
        <HostPrefrencesForm share_link={String(page.params.share_link)} />
      )}
      {page.route === "recipe" && (
        <ViewRecipe recipe_id={Number(page.params.recipe_id)}/>
      )}
      {page.route === "editDraft" && (
        <RecipeForm draft_id={Number(page.params.draft_id)} />
      )}
    </Flex>
  );
}

export default App;