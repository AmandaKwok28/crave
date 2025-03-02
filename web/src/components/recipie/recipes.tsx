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
        <Flex gap="3" wrap="wrap">
            {recipes.map((card:RecipeType) => (
                <RecipeCard key={card.id} recipe={card} /> 
            ))}
        </Flex>
    )
}

export default Recipes;