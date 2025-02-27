import { useStore } from "@nanostores/react";
import { $router } from "./lib/router";
import Home from "./pages/home";
import Search from "./pages/search";

function App() {

  const page = useStore($router);

  if (!page) {
    return (
      <div className="flex justify-center items-center">
        404 Not found
      </div>
    )
  }

  return (
    <div>
      {page.route === "home" && (<Search/>)}
      {page.route === "search" && (<Search/>)}
    </div>
  );
}

export default App;