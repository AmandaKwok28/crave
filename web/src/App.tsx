import { useStore } from "@nanostores/react";
import { $router } from "./lib/router";
import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Register from "./pages/register";
import { redirectPage } from "@nanostores/router";
import { useEffect } from "react";
import { useAuth } from "./hooks/use-auth";

function App() {
  const page = useStore($router);

  if (!page) {
    return (
      <div className="flex justify-center items-center">
        404 Not found
      </div>
    )
  }

  const { user, getUser } = useAuth();

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 // if the user hasn't been set, they shouldn't access pages other than login / register
  if (!user.id) {
    if (page.route === "home" || page.route === "profile") {
      redirectPage($router, "login");
    }
  }

  return (
    <div className="w-screen">
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

    </div>
  );
}

export default App;