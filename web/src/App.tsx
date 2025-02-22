import { Box, Flex} from "@chakra-ui/react";
import NavBar from "./components/layout/navBar";
import { useStore } from "@nanostores/react";
import { $router } from "./lib/router";
import Home from "./pages/home";

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
      {page.route === "home" && (
        <Home/>
      )}
    </div>
  );
}

export default App;