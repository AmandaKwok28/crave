import { useStore } from "@nanostores/react";
import { $router } from "./lib/router";
import Home from "./pages/home";
import CreateRecipe from "./pages/createRecipe";
import ViewRecipe from "./pages/viewRecipe";

function App() {

  const page = useStore($router);

  if (!page) {
    return (
      <div className="flex items-center justify-center">
        404 Not found
      </div>
    )
  }

  return (
    <div>
      {page.route === "home" && (
        <Home/>
      )}
      {page.route === "createRecipe" && (
        <CreateRecipe/>
      )}
      {page.route === "recipe" && (
        <ViewRecipe recipe_id={Number(page.params.recipe_id)}/>
      )}
      
    </div>
  );
}

export default App;