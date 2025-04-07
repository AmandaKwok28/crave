import { RecipeType } from "@/data/types";
import { Flex, Text } from "@chakra-ui/react";
import RecipeCard from "../layout/recipeCard";

const Recipes = ({recipes}:{recipes:RecipeType[]}) => {
    if (recipes.length === 0) {
        return (
            <Text mt='14' fontSize='xl'>No recipes found, create one to get started!</Text>
        );
    }

    return (
        <Flex gap="10" wrap="wrap" justifyContent="center" w="full">
            {recipes.map((card:RecipeType) => (
                <RecipeCard recipe={card} /> 
            ))}
        </Flex>
    )
}

export default Recipes;