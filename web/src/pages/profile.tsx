import NavBar from "@/components/layout/navBar";
import Recipes from "@/components/recipie/recipes";
import { useAuth } from "@/hooks/use-auth";
import useQueryRecipes from "@/hooks/use-query-recipes";
import { Box, Button, Flex } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react"
import { useState } from "react";

function TabButton({
  label, value, curtab, callback
}: { 
  label: string; value: string; curtab: string; callback: (v: string) => void
}) {
  return (
    <Button 
      className="w-full" 
      bgGradient="to-l"
      gradientFrom="teal.300"
      gradientTo="blue.400"
      filter={curtab === value ? 'brightness(70%)' : undefined}
      onClick={() => callback(value)}
    >
      {label}
    </Button>
  );
}

const Profile = () => {
  const { user } = useAuth();
  const { recipes, drafts, likes, bookmarks } = useQueryRecipes();

  const [ tab, setTab ] = useState<string>('recipes'); 
  
  return (
    <Flex direction="column">
      <NavBar />
      <Flex bg="white" w="100vw" minH="100vh" mt="5vh" overflowY="auto">
        <Flex direction="row" minH="100vh" overflowY="auto">                
          <Box 
            direction="row"
            minH="100vh"
            w="20vw"
            bgGradient="to-l" gradientFrom="green.200" gradientTo="blue.300"
            overflowY="auto"
            position="fixed"
            zIndex="100"
          >
            <div className="max-h-sm h-auto flex flex-col self-start w-full">
                <div className="flex items-center flex-row">
                    <Box className="p-4 items-center">
                        <Image borderRadius="full" src="anon.jpg" boxSize="50px"/>
                    </Box>
                    <div>
                        <h2 className="text-white text-xl font-bold">
                            {user.name}
                        </h2>
                        <h1 className="text-white">
                            {user.email}
                        </h1>
                    </div>
                </div>

                <div className="max-h-sm h-auto p-4 text-white w-full space-y-2">
                  <TabButton 
                    label='My Recipes'
                    value='recipes'
                    curtab={tab}
                    callback={setTab}
                  />

                  <TabButton 
                    label='My Drafts'
                    value='drafts'
                    curtab={tab}
                    callback={setTab}
                  />

                  <TabButton 
                    label='My Likes'
                    value='likes'
                    curtab={tab}
                    callback={setTab}
                  />

                  <TabButton 
                    label='My Bookmarks'
                    value='bookmarks'
                    curtab={tab}
                    callback={setTab}
                  />
                </div>
            </div>
          </Box>
            
          <Flex direction="row" m="3" wrap="wrap" ml="22vw">
            {tab === 'recipes' && <Recipes recipes={recipes.filter((r) => r.authorId === user.id)} />}
            {tab === 'drafts' && <Recipes recipes={drafts} />}
            {tab === 'likes' && <Recipes recipes={likes} />}
            {tab === 'bookmarks' && <Recipes recipes={bookmarks} />}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Profile;