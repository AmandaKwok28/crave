import NavBar from "@/components/layout/navBar";
import DeleteRecipe from "@/components/recipie/deleteRecipe";
import DisplayIngredients from "@/components/recipie/displayIngredients";
import SimilarRecipesSlider from "@/components/recipie/similarRecipesSlider";
import { RecipeType } from "@/data/types";
import useQueryRecipes from "@/hooks/use-query-recipes";
import useSimilarRecipes from "@/hooks/use-similar-recipes";
import { Blockquote, Box, ButtonGroup, Center, Flex, Spinner, Stack, Text } from "@chakra-ui/react";

const ViewRecipe = ({ recipe_id }: { 
    recipe_id: number; 
}) => {
    const { recipes, drafts } = useQueryRecipes();
    const currRecipe: RecipeType | undefined = recipes.find((r) => r.id === recipe_id) ?? drafts.find((r) => r.id === recipe_id);
    console.log(currRecipe)

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
    
    return (
        <Flex className="flex flex-col">
            <NavBar/>
            <Stack mt="10" direction="row" >
                <Box h="100%" w="60%">
                    <Text
                    color="Black"
                    textStyle="5xl"
                    ml="2rem"
                    textAlign="left"
                    fontWeight="bold"
                    mt="1rem">
                        {currRecipe.title}
                    </Text>
                    <Text
                    color="gray.600"
                    fontSize="xl"
                    ml="3rem"> 
                    
                        {currRecipe.description} 
                    </Text>
                    <Text
                    color="Black"
                    fontSize="3xl"
                    ml="4rem">
                        Ingredients List:
                    </Text>
                    <Flex  ml="6rem">
                        <DisplayIngredients ingredient_list={currRecipe.ingredients}/>
                    </Flex>
                </Box>
                <Center bgGradient="to-r" gradientFrom="teal.300" gradientTo="green.400" padding="4" color="white" w="50vw" h="50vh" mt="6rem" ml="6rem" mr="6rem" mb="3rem">
                    <Text fontSize="2rem">Image Placeholder </Text>
                </Center>
            </Stack>
            <Flex mb="20" ml="10" mr="10"> 
                <Text
                    color="Black"
                    fontSize="2rem"
                    ml="4rem">
                        Instructions: 
                </Text>
                <Blockquote.Root 
                    variant="solid" 
                    colorPalette="cyan.600" 
                    fontSize="1rem"
                    ml="2rem">
                        <Blockquote.Content >
                            {currRecipe.instructions[0]} 
                        </Blockquote.Content>
                        <Blockquote.Caption>
                            — Enjoy your tasty meal!
                        </Blockquote.Caption>
                </Blockquote.Root>

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