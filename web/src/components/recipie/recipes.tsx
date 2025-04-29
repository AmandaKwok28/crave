import { RecipeType } from "@/data/types";
import { Flex, Text, Image } from "@chakra-ui/react";
import RecipeCard from "../layout/recipeCard";

const Recipes = ({ 
    recipes, 
    showEmptyImage = true,
}:{
    recipes:RecipeType[], 
    showEmptyImage?: boolean
}) => {

    if (recipes.length === 0 && showEmptyImage) {
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
              No recipes found! Time to cook something up 🔥
            </Text>
          </Flex>
        );
    }

    return (
        <Flex gap="10" wrap="wrap" justifyContent="center" w="full">
            {recipes.map((card:RecipeType) => (
                <RecipeCard key={card.id} recipe={card}/> 
            ))}
        </Flex>
    )
}

export default Recipes;