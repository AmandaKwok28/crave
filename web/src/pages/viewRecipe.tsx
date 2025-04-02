import CommentList from "@/components/comment/commentList";
import NavBar from "@/components/layout/navBar";
import DeleteRecipe from "@/components/recipie/deleteRecipe";
import DisplayIngredients from "@/components/recipie/displayIngredients";
import SimilarRecipesSlider from "@/components/recipie/similarRecipesSlider";
import { bookmarkRecipe, fetchRecipe, likeRecipe, unbookmarkRecipe, unlikeRecipe } from "@/data/api";
import { RecipeType } from "@/data/types";
import { useAuth } from "@/hooks/use-auth";
import useSimilarRecipes from "@/hooks/use-similar-recipes";
import { Box, ButtonGroup, Center, Flex, Spinner, Image, Text, Button, HStack } from "@chakra-ui/react";
import { Bookmark, Heart } from "lucide-react";
import { useEffect, useState } from "react";

// Recipe page
const ViewRecipe = ({ recipe_id }: { 
  recipe_id: number; 
}) => {
  const { user } = useAuth();

  const [ recipe, setRecipe ] = useState<RecipeType | null>();
  const [ refresh, setRefresh ] = useState<boolean>(true);

  // Fetch similar recipes from the API
  const { similarRecipes, loading, error } = useSimilarRecipes(recipe_id);

  useEffect(() => {
    if (!refresh) {
      return;
    }

    setRefresh(false);

    fetchRecipe(recipe_id)
      .then((rec) => setRecipe(rec))
      .catch(console.error);
  }, [recipe_id, refresh]);

  const likeCallback = () => {
    if (!recipe) {
      return;
    }

    if (recipe.liked) {
      unlikeRecipe(recipe_id)
        .then(() => setRefresh(true))
        .catch(console.error);
    } else {
      likeRecipe(recipe_id)
        .then(() => setRefresh(true))
        .catch(console.error);
    }
  }

  const bookmarkCallback = () => {
    if (!recipe) {
      return;
    }

    if (recipe.bookmarked) {
      unbookmarkRecipe(recipe_id)
        .then(() => setRefresh(true))
        .catch(console.error);
    } else {
      bookmarkRecipe(recipe_id)
        .then(() => setRefresh(true))
        .catch(console.error);
    }
  }

  if (!recipe) {
    return (
      <Flex className="flex flex-col">
        <NavBar/>
        <Center w="100vw" h="100vh">
          {recipe === null && <Text>Recipe not found</Text>}
          {recipe === undefined && <Spinner />}
        </Center>
      </Flex>
    );
  }

  let priceVal = '$$$$';

  if (recipe.price === "CHEAP") {
    priceVal = "$";
  } else if (recipe.price === "MODERATE") {
    priceVal = "$$";
  } else if (recipe.price === "PRICEY") {
    priceVal = "$$$";
  }
  
  return (
    <Flex direction="column" alignContent="flex-start">
      <NavBar/>

      <Flex direction="row" width="full">
        <Flex direction="column" alignItems="flex-start" p="4" ml="2vw" gap='4'>
            <Text
                textStyle="5xl"
                textAlign="left"
                fontWeight="bold"
                mt="5vh"
            >
                {recipe.title}
            </Text>

              {/* Adding image here */}
              <Image rounded="md" src={recipe.image ? recipe.image : '/img_placeholder.jpg'} w='30vw' />

              <HStack>
                <Button
                  variant='ghost'
                  color={recipe.liked ? 'red.400' : 'gray.600'}
                  onClick={likeCallback}
                >
                  {recipe.likes} <Heart />
                </Button>

                <Button
                  variant='ghost'
                  color={recipe.bookmarked ? 'blue.400' : 'gray.600'}
                  onClick={bookmarkCallback}
                >
                  <Bookmark />
                </Button>
              </HStack>

              <Text
                fontSize='md'
                fontWeight='light'
                fontStyle='italic'
                whiteSpace='pre-line'
              >
                {recipe.description}
            </Text>
        </Flex>

        <Flex direction="column" alignItems="flex-start" p="4" gap="4" mt="28">
            <Text
              fontSize="2xl"
              fontWeight="bold"
              ml="4rem"
            >
              Ingredients
            </Text>
            <Flex ml="6rem">
              <DisplayIngredients ingredients={recipe.ingredients} />
            </Flex>

            {/* Instructions */}
            <Text
                ml="4rem"
                fontSize="2xl"
                fontWeight="bold"
                mt="12"
            > 
                Instructions
                <Text
                    fontSize='md'
                    fontWeight='normal'
                    whiteSpace='pre-line'
                >
                    {recipe.instructions}
                </Text>
            </Text>

            {/* Add tags info */}
            <Text
                ml="4rem"
                fontSize="2xl"
                fontWeight="bold"
                mt="12"
            > 
                Tags
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
                    Cuisine: {recipe.cuisine ? recipe.cuisine.toLowerCase() : ""}
                </Box>

                {recipe.allergens.map((a) => {
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
                    Difficulty: {recipe.difficulty ? recipe.difficulty.toLowerCase() : ""}
                </Box>

                {recipe.mealTypes && (
                    <Flex direction="row" gap="4" mt="2">
                        {recipe.mealTypes.map((type) => {
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

                {recipe.sources && (
                    <Flex direction="row" gap="4" mt="2">
                        {recipe.sources.map((source) => {
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
      </Flex>

      {/* Similar Recipes Section - now positioned at the bottom */}
      <Box width="full" mt="8" px="4">
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
      </Box>
      
      
      <ButtonGroup m="8" position="fixed" bottom="0%" right="0%" gap="4">
        {recipe.authorId === user.id && (
          <DeleteRecipe recipe_id={recipe.id} />
        )}
         <CommentList recipe_id={recipe.id} />
      </ButtonGroup>

    </Flex>
  )
}

export default ViewRecipe;