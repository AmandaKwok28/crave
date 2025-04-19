import { RecipeType } from "@/data/types";
import { Flex, Text, Image } from "@chakra-ui/react";
import RecipeCard from "../layout/recipeCard";

const Recipes = ({recipes}:{recipes:RecipeType[]}) => {
    if (recipes.length === 0) {
        return (
            <Flex 
            height="80vh" 
            width="75vw"
            align="center" 
            justify="center"
            direction="column"
          >
            <Image
                boxSize="300px" 
                objectFit="contain"
                src="/no_recipe_fallback.png">
            </Image>
            <Text fontSize="xl" fontWeight="light" color="gray.600">
              No recipes found!
            </Text>
          </Flex>
        );
    }

    return (
        <Flex gap="10" wrap="wrap" justifyContent="center" w="full">
            {recipes.map((card:RecipeType) => (
                <RecipeCard key={card.id} recipe={card} /> 
            ))}
        </Flex>
    )
}

export default Recipes;