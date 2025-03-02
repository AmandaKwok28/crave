import NavBar from "@/components/layout/navBar";
import Recipes from "@/components/recipie/recipes";
import { useAuth } from "@/hooks/use-auth";
import useQueryRecipes from "@/hooks/use-query-recipes";
import { Box, Button, Flex } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react"
import { useState } from "react";

const Profile = () => {
    const { user } = useAuth();
    const { recipes, drafts } = useQueryRecipes();

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
                            <Button 
                                className="w-full" 
                                bgGradient="to-l" gradientFrom="teal.300" gradientTo="blue.400"
                                filter={tab === 'recipes' ? 'brightness(70%)' : undefined}
                                onClick={() => setTab('recipes')}
                            >
                                My Recipes
                            </Button>

                            <Button 
                                className="w-full" 
                                bgGradient="to-l" gradientFrom="teal.300" gradientTo="blue.400"
                                filter={tab === 'drafts' ? 'brightness(70%)' : undefined}
                                onClick={() => setTab('drafts')}
                            >
                                My Drafts
                            </Button>
                        </div>
                    </div>

                </Box>
                
                <Flex direction="row" m="3" wrap="wrap" ml="22vw">
                    {tab === 'recipes' && <Recipes recipes={recipes.filter((r) => r.authorId === user.id)} />}
                    {tab === 'drafts' && <Recipes recipes={drafts} />}
                </Flex>
            </Flex>
        </Flex>
        </Flex>
    )
}

export default Profile;