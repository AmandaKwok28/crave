import NavBar from "@/components/layout/navBar";
import {Box, 
        Button, 
        Flex, 
        Input, 
        MenuContent, 
        MenuItem, 
        MenuRoot, 
        MenuTrigger, 
        Spacer, 
        Stack, 
        Text } from "@chakra-ui/react";
import RecipeCard from "@/components/layout/recipeCard";
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
  } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider";
import useQueryRecipes from "@/hooks/use-query-recipes";
import { RecipeType } from "@/data/types";



const Home = () => {
    const { recipes } = useQueryRecipes();

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
                bgGradient='to-r' gradientFrom="cyan.700" gradientTo="cyan.400"
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
                    //background="gray.200" 
                    opacity="0.7"
                    backgroundColor="rgba(211, 211, 211, 0.4)"
                    w="60vw"
                    m="5vh"
                    direction="column"
                >
                    {/* <Stack gap="12" m="5">
                        <Input
                            placeholder=" Find the recipes you crave..."
                            color="white"
                            w="55vw"
                            variant="outline"
                        />
                        <Slider 
                            min={0}
                            max={50}
                            label="Price"
                            value={[10, 25]} 
                            color="black"
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
                    </Stack> */}
                </Flex>
            </Flex>
            <Box 
                bg="white" 
                flex="1" 
                className="w-screen">
                <Text 
                    textStyle="2xl"
                    color="black"
                    fontWeight="bold"
                    m="4"> 
                    Trending
                </Text>
                <Flex direction="row" m="4" gap="6" wrap="wrap">
                {recipes.map((card:RecipeType) => (
                    <RecipeCard key={card.id} recipe={card} /> 
                ))}
                </Flex>
            </Box>
        </Flex>
    )
}

export default Home;