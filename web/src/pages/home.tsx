import NavBar from "@/components/layout/navBar";
import {Box, 
        Flex, 
        Spacer, 
        Text, } from "@chakra-ui/react";
import RecipeCard from "@/components/layout/recipeCard";



const Home = () => {
    return (
        <Flex
            direction="column"
            className="min-h-screen"
            style={{ backgroundColor: "white" }}
        >
            <NavBar />

            {/* App Name */}
            <Flex 
                direction="row"
                bg="cyan.700" 
                h="60vh" 
                className="w-screen"
            >
                <Box
                    alignContent="center"
                    p="16px"
                >
                    <Text
                        textStyle="7xl"
                        fontWeight="bold"
                    > 
                        Crave. 
                    </Text>
                    <Text
                        textStyle="2xl"
                        fontWeight="bold"
                        color="gray.300"
                    > 
                        A recipe crowdsouring app for college students.
                    </Text>
                </Box>

                <Spacer/>

                {/* Home Page Search Box */}
                <Flex 
                    background="cyan.800" 
                    w="60vw"
                    m="5vh"
                    direction="column"
                >
                    <Flex 
                        color="white" 
                        align="center" 
                        justify="center" 
                    >
                        Random search buttons  
                    </Flex>
                    {/* <Stack gap="12" m="5">
                        <Input
                            placeholder=" Find the recipes you crave..." 
                            background="cyan.700"
                            opacity="0.5"
                            variant="subtle"
                            color="white"
                            w="55vw"
                        />
                        <Slider 
                            min={0}
                            max={50}
                            label="Price"
                            value={[10, 25]} 
                            color="white"
                            w="55vw"
                            size="sm"
                            variant="solid"
                            colorPalette="cyan"
                            marks={[
                                { value: 0, label: "$0" },
                                { value: 25, label: "$25" },
                                { value: 50, label: "$50+" },
                              ]}
                        />
                        <Flex direction="row" gap="4" justifyContent="center">
                            
                            <Flex direction="column">
                                <MenuRoot>
                                    <MenuTrigger asChild>
                                        <Button 
                                            variant="outline" 
                                            bg="cyan.700" 
                                            size="xs"
                                            fontSize={12}
                                            >
                                            <Text m="4">Cook Time</Text>
                                        </Button>
                                    </MenuTrigger>
                                    <MenuContent >
                                        <MenuItem value="profile">
                                            profile
                                        </MenuItem>
                                        <MenuItem value="logout">
                                            logout
                                        </MenuItem>
                                    </MenuContent>
                                </MenuRoot>
                            </Flex>

                            <Flex direction="column">
                                <MenuRoot>
                                    <MenuTrigger asChild>
                                        <Button 
                                            variant="outline" 
                                            bg="cyan.700" 
                                            size="xs"
                                            fontSize={12}
                                            >
                                            <Text m="4">Cuisine</Text>
                                        </Button>
                                    </MenuTrigger>
                                    <MenuContent >
                                        <MenuItem value="American">
                                            American
                                        </MenuItem>
                                        <MenuItem value="Chinese">
                                            Chinese
                                        </MenuItem>
                                        <MenuItem value="Indian">
                                            Indian
                                        </MenuItem>
                                        <MenuItem value="French">
                                            French
                                        </MenuItem>
                                    </MenuContent>
                                </MenuRoot>
                            </Flex>

                        </Flex>
                    
                    </Stack> */}
                </Flex>
            </Flex>
            <Box 
                bg="white" 
                flex="1" 
                className="w-screen"
                m="4">
                <RecipeCard/>
            </Box>
        </Flex>
    )
}

export default Home;