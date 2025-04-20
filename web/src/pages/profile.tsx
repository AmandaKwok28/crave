import NavBar from "@/components/layout/navBar";
import Parties from "@/components/party/parties";
import Recipes from "@/components/recipie/recipes";
import { Field } from "@/components/ui/field";
import useQueryParties from "@/hooks/party/use-query-party";
import { useAuth } from "@/hooks/use-auth";
import useMutationUser from "@/hooks/use-mutation-user";
import useQueryRecipes from "@/hooks/use-query-recipes";
import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react"
import { KeyboardEvent, useState } from "react";

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
  const { updateAvatar } = useMutationUser();
  const { recipes, drafts, likes, bookmarks } = useQueryRecipes();
  const { parties } = useQueryParties();

  const [ tab, setTab ] = useState<string>('recipes'); 
  const [ url, setUrl ] = useState<string>('');

  const handleImageFile = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateAvatar(url);
      setUrl('');
    }
  }
  
  return (
    <Flex direction="column">

      <NavBar />

      {/* Sidebar */}
      <Flex bg="white" w="100vw" minH="100vh" mt="4vh" overflowY="auto">
        <Flex direction="row" minH="100vh" overflowY="auto">                
          <Box 
            direction="row"
            minH="100vh"
            h="100vh"
            w="20vw"
            bgGradient="to-l" gradientFrom="green.200" gradientTo="blue.300"
            position="fixed"
            zIndex="100"
          >
            <div className="flex flex-col self-start w-full h-auto max-h-sm">

                {/* User info: avatar, email, username */}
                <Flex direction="row" align="center" p="2" mt="2" mr="2">
                  <Flex direction="row" align="center" spaceX="2">
                    <Box p="1">
                        <Image borderRadius="full" src={user.avatarImage ? user.avatarImage : '/anon.jpg'} boxSize="50px"/>
                    </Box>
                    <Flex direction="column">
                        <h2 className="text-xl font-bold text-white">
                            {user.name}
                        </h2>
                        <h1 className="text-white">
                            {user.email}
                        </h1>
                    </Flex>
                  </Flex>
                </Flex>

                
                <div className="w-full h-auto p-4 space-y-2 text-white max-h-sm">

                  <Field label="Image Url">
                    <Input
                      bg="white"
                      color="black"
                      placeholder="Enter an image url"
                      onKeyDown={(e) => handleImageFile(e)}
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    >
                    </Input>
                  </Field>

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

                  <TabButton 
                    label='My Collaborative Parties'
                    value='parties'
                    curtab={tab}
                    callback={setTab}
                  />  
                </div>
            </div>
          </Box>
            
          <Flex direction="row" m="3" wrap="wrap" ml="22vw" mt="5vh">
            {tab === 'recipes' && <Recipes recipes={recipes.filter((r) => r.authorId === user.id)} />}
            {tab === 'drafts' && <Recipes recipes={drafts} />}
            {tab === 'likes' && <Recipes recipes={likes} />}
            {tab === 'bookmarks' && <Recipes recipes={bookmarks} />}
            {tab === 'parties' && <Parties parties={parties}/>}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Profile;