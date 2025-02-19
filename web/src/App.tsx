import Demo from "./components/layout/demo";
import Users from "./components/user/users";

function App() {

  return (
    <div className="flex items-center justify-center min-h-screen text-3xl">
      <div>
        <Demo></Demo>
      </div>
      <div>
        <Users/>
      </div>
    </div>
  );
}

export default App;