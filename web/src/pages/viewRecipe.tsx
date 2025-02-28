import NavBar from "@/components/layout/navBar";
import DeleteRecipe from "@/components/recipie/deleteRecipe";
import DisplayIngredients from "@/components/recipie/displayIngredients";
import { RecipeType } from "@/data/types";
import useQueryRecipes from "@/hooks/use-query-recipes";
import { Blockquote, Box, ButtonGroup, Center, Flex, Stack, Text } from "@chakra-ui/react";

const ViewRecipie = ({ recipe_id }: { 
    recipe_id: Number; 
}) => {
    const { recipes } = useQueryRecipes();
    const currRecipe: RecipeType | undefined = recipes.find((recipe: RecipeType) => recipe.id === recipe_id);

    if (currRecipe && currRecipe.published) {
        return (
            <Flex className="flex flex-col">
                <NavBar/>
                <Stack direction="row" >
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
                        fontSize="2rem"
                        ml="3rem"> 
                        
                            {currRecipe.description} 
                        </Text>
                        <Text
                        color="Black"
                        fontSize="2rem"
                        ml="4rem">
                            Ingredients List:
                        </Text>
                        <Flex  ml="6rem">
                            <DisplayIngredients ingredient_list={currRecipe.ingredients}/>
                        </Flex>
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
                        ml="4rem">
                            <Blockquote.Content >
                                {currRecipe.instructions[0]} 
                            </Blockquote.Content>
                            <Blockquote.Caption>
                                — Enjoy your tasty meal!
                            </Blockquote.Caption>
                        </Blockquote.Root>
                    </Box>
                    <Center background="green.500" padding="4" color="white" w="30rem" h="30rem" m="6rem">
                        <Text fontSize="2rem">Image Placeholder </Text>
                    </Center>
                </Stack>
                
                <ButtonGroup m="8" position="fixed" bottom="0%" right="0%">
                    <DeleteRecipe recipe={currRecipe} />
                </ButtonGroup>
            </Flex>
        )
    }
    else {
        return (
            <Flex className="flex flex-col">
                <NavBar/>
                <Box className="w=25% h-screen">
                    Recipe not Available
                </Box>
            </Flex>
        )
    }
    
}

export default ViewRecipie;