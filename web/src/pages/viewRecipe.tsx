import NavBar from "@/components/layout/navBar";
import DeleteRecipe from "@/components/recipie/deleteRecipe";
import DisplayIngredients from "@/components/recipie/displayIngredients";
import SimilarRecipesSlider from "@/components/recipie/similarRecipesSlider";
import { RecipeType } from "@/data/types";
import useQueryRecipes from "@/hooks/use-query-recipes";
import useSimilarRecipes from "@/hooks/use-similar-recipes";
import { Box, ButtonGroup, Center, Flex, Spinner, Image, Text } from "@chakra-ui/react";

// Recipe page
const ViewRecipe = ({ recipe_id }: { 
  recipe_id: number; 
}) => {
  const { user } = useAuth();

    // Fetch similar recipes from the API
    const { similarRecipes, loading, error } = useSimilarRecipes(recipe_id);

    if (!currRecipe) {
        return (
            <Flex className="flex flex-col">
                <NavBar/>
                <Center w="100vw" h="100vh">
                    Recipe not Available
                </Center>
            </Flex>
        );
    }

    let priceVal;
    if (currRecipe.price === "CHEAP") {
        priceVal = "$";
    } else if (currRecipe.price === "MODERATE") {
        priceVal = "$$";
    } else if (currRecipe.price === "PRICEY") {
        priceVal = "$$$";
    } else {
        priceVal = "$$$$"
    }
    
    return (
        <Flex direction="row" alignContent="flex-start">
            <NavBar/>

            <Flex direction="column" alignItems="flex-start" p="4" ml="2vw" gap="4">
                <Text
                    textStyle="5xl"
                    textAlign="left"
                    fontWeight="bold"
                    mt="5vh"
                >
                    {currRecipe.title}
                </Text>

                 {/* Adding image here */}
                 <Image rounded="md" src='/img_placeholder.jpg' w="30vw"/>

                 <Text
                    fontSize="2xl"
                    fontWeight="bold"
                 >
                    Recipe Description:
                    <Text
                        fontSize='md'
                        fontWeight='normal'
                    >
                        {currRecipe.description}
                    </Text>
                 </Text>
                 
            </Flex>

            <Flex direction="column" alignItems="flex-start" p="4" gap="4" mt="28">
                <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    ml="4rem">
                        Ingredients List:
                </Text>
                <Flex  ml="6rem">
                    <DisplayIngredients ingredient_list={currRecipe.ingredients}/>
                </Flex>

                {/* Instructions */}
                <Text
                    ml="4rem"
                    fontSize="2xl"
                    fontWeight="bold"
                    mt="12"
                > 
                    Instructions:
                    <Text
                        fontSize='md'
                        fontWeight='normal'
                    >
                        {currRecipe.instructions}
                    </Text>
                </Text>

                {/* Add tags info */}
                <Text
                    ml="4rem"
                    fontSize="2xl"
                    fontWeight="bold"
                    mt="12"
                > 
                    All Tags: 
                </Text>
                <Flex 
                    direction="row"
                    ml="4rem"
                    fontSize="md"
                    fontWeight='normal'
                    gap="2"
                    wrap="wrap"
                    w="40vw"
                >
                    <Box 
                        borderRadius="10px"
                        borderWidth="1px"
                        p="1"
                        px="4"
                        display="flex" // Enables flexbox
                        alignItems="center" // Centers content vertically
                        justifyContent="center" // Centers content horizontally
                        w="fit-content"
                        mt="2"
                        bgGradient="to-r"
                        gradientFrom="blue.300"
                        gradientTo="blue.500"
                        color="white"
                    > 
                        Price: {priceVal}
                    </Box>

                    <Box 
                        borderRadius="10px"
                        borderWidth="1px"
                        p="1"
                        px="2"
                        alignItems="center" 
                        justifyContent="center" 
                        w="fit-content"
                        mt="2"
                        bgGradient="to-r"
                        gradientFrom="cyan.300"
                        gradientTo="blue.400"
                        color="white"
                    > 
                        Cuisine: {currRecipe.cuisine ? currRecipe.cuisine.toLowerCase() : ""}
                    </Box>

                    {currRecipe.allergens.map((a) => {
                        return (
                            <Box 
                                key={a}
                                borderRadius="10px"
                                borderWidth="1px"
                                p="1"
                                px="2"
                                display="flex" // Enables flexbox
                                alignItems="center" // Centers content vertically
                                justifyContent="center" // Centers content horizontally
                                mt="2"
                                bgGradient="to-r"
                                gradientFrom="red.500"
                                gradientTo="red.700"
                                color="white"
                            > 
                                Allergens: {a}
                            </Box>
                        )
                    })}

                    <Box 
                        borderRadius="10px"
                        borderWidth="1px"
                        p="1"
                        px="2"
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center"
                        mt="2"
                        bgGradient="to-r"
                        gradientFrom="cyan.400"
                        gradientTo="purple.700"
                        color="white"
                    > 
                        Difficulty: {currRecipe.difficulty ? currRecipe.difficulty.toLowerCase() : ""}
                    </Box>

                    {currRecipe.mealTypes && (
                        <Flex direction="row" gap="4" mt="2">
                            {currRecipe.mealTypes.map((type) => {
                                return (
                                    <Box 
                                        key={type}
                                        borderRadius="10px"
                                        borderWidth="1px"
                                        p="1"
                                        px="2"
                                        display="flex" // Enables flexbox
                                        alignItems="center" // Centers content vertically
                                        justifyContent="center" // Centers content horizontally
                                        bgGradient="to-r"
                                        gradientFrom="teal.300"
                                        gradientTo="green.400"
                                        color="white"
                                    > 
                                        Meal Types: {type}
                                    </Box>
                                )
                            })}
                            
                        </Flex>
                    )}

                    {currRecipe.sources && (
                        <Flex direction="row" gap="4" mt="2">
                            {currRecipe.sources.map((source) => {
                                return (
                                    <Box 
                                        key={source}
                                        borderRadius="10px"
                                        borderWidth="1px"
                                        p="1"
                                        px="2"
                                        display="flex" 
                                        alignItems="center" 
                                        justifyContent="center" 
                                        bgGradient="to-r"
                                        gradientFrom="purple.300"
                                        gradientTo="purple.500"
                                        color="white"
                                    > 
                                        {source}
                                    </Box>
                                )
                            })}
                            
                        </Flex>
                    )}      

                </Flex>

            </Flex>

            
            {/* Display loading spinner while fetching similar recipes */}
            {loading ? (
                <Center py={8}>
                    <Spinner size="xl" color="teal.500" />
                </Center>
            ) : error ? (
                <Center py={8}>
                    <Text color="red.500">Failed to load similar recipes</Text>
                </Center>
            ) : similarRecipes.length === 0 ? (
                <Center py={8}>
                    <Text color="gray.500">Similar recipes not available yet</Text>
                </Center>
            ) : (
                <SimilarRecipesSlider recipes={similarRecipes} currentRecipeId={recipe_id} />
            )}


            
            <ButtonGroup m="8" position="fixed" bottom="0%" right="0%">
                <DeleteRecipe recipe={currRecipe} />
            </ButtonGroup>
        </Flex>
    )
}

export default ViewRecipe;