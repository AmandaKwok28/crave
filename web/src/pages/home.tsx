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
import { $isMobile, setFilters, setSearchTerm } from "@/lib/store";
import Prices from "@/components/search/prices";
import DifficultyButtons from "@/components/search/DifficultyButtons";
import { Difficulty } from "@/data/types";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { openPage } from "@nanostores/router";
import { $router } from "@/lib/router";
import { useStore } from "@nanostores/react";

const Home = () => {
    const { recipes } = useQueryRecipes(true);
    const { recommendedRecipes, isLoading, error } = useRecommendedRecipes(10);
    const [cookTime, setCookTime] = useState<[number, number]>([10, 20]);
    const isMobile = useStore($isMobile);


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
                h={isMobile ? '200px' : '500px'}
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
                        textStyle={isMobile ? "3xl" : "7xl"}
                        fontWeight="bold"
                        color='bg'
                    > 
                        Crave. 
                    </Text>
                    <Text
                        textStyle={isMobile ? "md" : "2xl"}
                        fontWeight="bold"
                        color="gray.300"
                    > 
                        A recipe crowdsouring app for college students.
                    </Text>
                </Box>

                <Spacer/>

                {/* Home Page Search Box */}
                {!isMobile && (
                    <>
                    
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
                </>
                )}
         
            </Flex>
            

            {/* Recommended Section: note, takes a solid minute to load data and then it scrolls well */}
            <Text 
                textStyle={isMobile ? "md" : "2xl"}
                color="black"
                fontWeight="bold"
                m="4"
            > 
                Recommended For You
            </Text>
            <Box 
                width="100%" 
                pt="8" 
                display="flex" 
                justifyContent="center" // Center the content horizontally
                alignItems="center" // Center the content vertically (if needed)
            >
                
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
                    <Box 
                    width={isMobile ? "100%" : "80%"} 
                    mb="12" 
                    display="flex" 
                    justifyContent="center" // Center slider content
                    >
                    <SimilarRecipesSlider 
                        recipes={recommendedRecipes} 
                        currentRecipeId={undefined} 
                        title=""
                    />
                    </Box>
                )}
                </Box>


            {/* Trending Section */}
            <Flex 
                bg="white" 
                w="100vw"
                direction="column"
            >
                <Text 
                    textStyle="2xl"
                    color="black"
                    fontWeight="bold"
                    m="4"
                    p={2}
                > 
                    Recipes:
                </Text>
                <Flex 
                    direction="row" 
                    w="full"
                    gap="6" 
                    align="center"
                    mb='16'
                    p={10}
                    wrap="wrap" 
                    justify="center"
                    justifyContent="center"
                >
                    <Recipes recipes={recipes}/>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Home;