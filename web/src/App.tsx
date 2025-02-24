import { useStore } from "@nanostores/react";
import { $router } from "./lib/router";
import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/profile";

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
      {page.route === "login" && (
        <Login/>
      )}
      {page.route === "profile" && (
        <Profile/>
      )}
    </div>
  );
}

export default App;