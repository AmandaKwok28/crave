import Demo from "./components/layout/demo";
import Users from "./components/user/users";
import { Blockquote} from "@chakra-ui/react";

function App() {

  return (
    <div className="flex items-center justify-center min-h-screen text-3xl">
      <div>
        <Demo></Demo>
      </div>
      <div ml-4>
        <Blockquote.Root>
          <Blockquote.Content>
            <Users/>
          </Blockquote.Content>
        </Blockquote.Root>
        
      </div>
    </div>
  );
}

export default App;