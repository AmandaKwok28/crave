import NavBar from "@/components/layout/navBar";
import {Box, 
        Button, 
        Flex, 
        Input, 
        Spacer, 
        Text,
        Spinner,
        Center
} from "@chakra-ui/react";
import useQueryRecipes from "@/hooks/use-query-recipes";
import useRecommendedRecipes from "@/hooks/use-recommended-recipes";
import Recipes from "@/components/recipie/recipes";
import SimilarRecipesSlider from "@/components/recipie/similarRecipesSlider";
import { SearchIcon } from "lucide-react";
import { setFilters, setSearchTerm } from "@/lib/store";
import Prices from "@/components/search/prices";
import DifficultyButtons from "@/components/search/DifficultyButtons";
import { Difficulty } from "@/data/types";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { openPage } from "@nanostores/router";
import { $router } from "@/lib/router";
import { useAuth } from "@/hooks/use-auth";
import useQueryUser from "@/hooks/use-query-user";

const Home = () => {
    const { user } = useAuth();
    const { following } = useQueryUser(user.id);
    console.log(user);
    const { recipes } = useQueryRecipes(true);
    const { recommendedRecipes, isLoading, error } = useRecommendedRecipes(10);
    const [cookTime, setCookTime] = useState<[number, number]>([10, 20]);
    const handleCookTimeChange = (details: { value: [number, number] }) => {
        setCookTime(details.value);
        const change = {
            prepTimeMin: details.value[0],
            prepTimeMax: details.value[1],
        }
        setFilters(change);
    }
    
    return (
        <Flex
            direction="column"
            className="min-h-screen"
            w="100vw"
            overflowX="hidden"
            style={{ backgroundColor: "white" }}
        >
            <NavBar />

            {/* App Name */}
            <Flex 
                direction="row"
                bgGradient="to-r"
                gradientFrom="cyan.500"
                gradientTo="purple.600"
                h="auto" 
                minH="500px"
                w="100vw"
                overflowX="hidden"
                mt={4}
            >
                <Box
                    alignContent="center"
                    p="16px"
                    ml="4"
                >
                    <Text
                        textStyle="7xl"
                        fontWeight="bold"
                        color='bg'
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
                    backgroundColor="rgba(211, 211, 211, 0.4)"
                    w="50vw"
                    m="auto"
                    mr="2vw"
                    direction="column"
                    borderRadius="20px"
                    gap="8"
                    p="12"
                    maxW="100%"
                    maxH="100%"
                >
                    {/* Search Bar */}
                    <Flex direction="row" alignItems="center" gap="2">
                        <SearchIcon color="white"/>
                        <Input
                            placeholder="Find the recipes you crave..."
                            fontSize="sm"
                            variant="flushed"
                            color="white"
                            _placeholder={{ color: 'white' }}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            p="2"
                        >
                        </Input>
                    </Flex>

                    {/* Prices Filter */}
                    <Prices />

                    {/* Difficulty Filter */}
                    <Box >
                        <DifficultyButtons 
                            title="Difficulty" 
                            options={Object.values(Difficulty)} 
                            color="white" 
                            home={true}
                        />
                    </Box>

                    {/* Search Bar */}
                    <Slider 
                        min={0}
                        max={120}
                        size="sm"
                        variant="solid"
                        defaultValue={cookTime}
                        value={cookTime}
                        label="Cook Time"
                        marks={[
                            { value: 0, label: "0" },
                            { value: 60, label: "1h" },
                            { value: 120, label: "2h+" },
                        ]}
                        color="white"
                        colorPalette="purple"
                        onValueChange={handleCookTimeChange}
                    >
                    </Slider>

                    {/* Search Button */}
                    <Button 
                        borderRadius="10px"
                        bgGradient="to-l"
                        gradientFrom="cyan.500"
                        gradientTo="purple.600"
                        onClick={() => openPage($router, "search")}
                    >
                        Search
                    </Button>
                </Flex>
            </Flex>

            {/* Recommended Section */}
            <Box width="100%" pt="8">
                <Text 
                    textStyle="2xl"
                    color="black"
                    fontWeight="bold"
                    m="4"
                > 
                    Recommended For You
                </Text>
                {isLoading ? (
                    <Center py="8">
                        <Spinner size="xl" color="teal.500" />
                    </Center>
                ) : error ? (
                    <Center py="8">
                        <Text color="red.500">Failed to load recommendations</Text>
                    </Center>
                ) : recommendedRecipes.length === 0 ? (
                    <Center py="8">
                        <Text color="gray.500">Explore recipes to get personalized recommendations</Text>
                    </Center>
                ) : (
                    <Box width="full" mb="12">
                        <SimilarRecipesSlider 
                            recipes={recommendedRecipes} 
                            currentRecipeId={undefined} 
                            title=""
                        />
                    </Box>
                )}
            </Box>

            {/* Following Section */}
            <Flex 
                bg="white" 
                w="100vw"
                direction="column"
            >
                <Text 
                    textStyle="2xl"
                    color="black"
                    fontWeight="bold"
                    m="4"> 
                    Following
                </Text>
                <Flex 
                    direction="row" 
                    w="full"
                    gap="6" 
                    align="center"
                    mb='16'
                    wrap="wrap" 
                    justify="center"
                    justifyContent="center"
                >
                    <Recipes 
                        recipes={recipes.filter(recipe => 
                            following && following.length > 0 && 
                            following.some(follow => follow.id === recipe.author.id)
                        )}
                        showEmptyImage={false}
                    />
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Home;