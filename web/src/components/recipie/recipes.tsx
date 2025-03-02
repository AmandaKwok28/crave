import { RecipeType } from "@/data/types";
import { Flex } from "@chakra-ui/react";
import RecipeCard from "../layout/recipeCard";

const Recipes = ({recipes}:{recipes:RecipeType[]}) => {
    return (
        <Flex gap="3" wrap="wrap">
            {recipes.map((card:RecipeType) => (
                <RecipeCard key={card.id} recipe={card} /> 
            ))}
        </Flex>
    )
}

export default Recipes;