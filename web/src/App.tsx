import { useStore } from "@nanostores/react";
import { $router } from "./lib/router";
import Home from "./pages/home";
import Register from "./pages/register";
import { redirectPage } from "@nanostores/router";
import { useEffect } from "react";
import { useAuth } from "./hooks/use-auth";

function App() {
  const page = useStore($router);

  const { user, getUser } = useAuth();

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!page) {
    return (
      <div className="flex justify-center items-center">
        404 Not found
      </div>
    )
  }

  if (page.route === 'register') {
    return <Register />;
  } else if (!user.id) {
    redirectPage($router, 'register');
    return null;
  }

  return <Home />;
}

export default App;