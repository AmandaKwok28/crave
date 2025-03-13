import NavBar from "@/components/layout/navBar";
import DeleteRecipe from "@/components/recipie/deleteRecipe";
import DisplayIngredients from "@/components/recipie/displayIngredients";
import { fetchRecipe, likeRecipe, unlikeRecipe } from "@/data/api";
import { RecipeType } from "@/data/types";
import { useAuth } from "@/hooks/use-auth";
import { Blockquote, Box, Button, Center, Flex, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

// Recipe page
const ViewRecipe = ({ recipe_id }: { 
  recipe_id: number; 
}) => {
  const { user } = useAuth();

  const [ recipe, setRecipe ] = useState<RecipeType | null>();

  // When set to true, regrabs recipe and like data
  const [ refresh, setRefresh ] = useState<boolean>(true);

  useEffect(() => {
    if (!refresh) {
      return;
    }

    fetchRecipe(recipe_id)
      .then((res) => setRecipe(res))
      .catch(() => setRecipe(null));
    
    setRefresh(false);
  }, [ recipe_id, refresh ]);

  const likeCallback = () => {
    if (!recipe) {
      return;
    }

    if (recipe.liked) {
      unlikeRecipe(recipe.id)
        .finally(() => setRefresh(true));
    } else {
      likeRecipe(recipe.id)
        .finally(() => setRefresh(true));
    }
  };

  if (!recipe) {
    return (
      <Flex className="flex flex-col">
        <NavBar/>
        <Center w="100vw" h="100vh">
          {recipe === undefined && <Spinner />}
          {recipe === null && <Text>Recipe not Available</Text>}
        </Center>
      </Flex>
    );
  }

  return (
    <VStack gap='4' my='16' w='100vw'>
      <NavBar />

      <HStack align='items-start' justify='center' flexWrap='wrap-reverse' mb='8'>
        {/* Left side: title, desc, and ingredients */}
        <VStack w={{ base: '85vw', lg: '40vw' }} align='flex-start' mt={{ base: '0', lg: '4' }}>
          <HStack w='100%' justify='space-between' align='flex-start'>
            <VStack align='flex-start'>
              <Text fontSize='3xl' fontWeight='bold' whiteSpace='pre-line'>
                {recipe.title}
              </Text>
              <Text fontSize='xl' fontWeight='light' fontStyle='italic' whiteSpace='pre-line'>
                {recipe.description}
              </Text>
            </VStack>
            
            <VStack align='flex-end'>
              <HStack>
                <Button 
                  variant='ghost'
                  color={recipe.liked ? 'red.400' : 'gray.600'}
                  onClick={likeCallback}
                  px='2.5'
                >
                  {recipe.likes.toLocaleString()}
                  <Heart />
                </Button>
              </HStack>

              {recipe.authorId === user.id && <DeleteRecipe recipe_id={recipe.id} />}
            </VStack>
          </HStack>

          <VStack mt='5'>
            <Text>Ingredients</Text>
            <DisplayIngredients ingredients={recipe.ingredients} />
          </VStack>
        </VStack>

        {/* Right side: image */}
        <VStack w={{ base: '85vw', lg: '40vw' }} align={{ base: 'center', lg: 'flex-end' }}>
          <Box
            bgGradient="to-r"
            gradientFrom="teal.300"
            gradientTo="green.400"
            w='100%'
            h={{ base: '25rem', lg: '30rem' }}
            rounded='3xl'
          />
        </VStack>
      </HStack>

      <VStack align='flex-start' w={{ base: '85vw', lg: '80vw' }}>
        <Text fontSize='2xl'>Instructions</Text>
        <Blockquote.Root>
          <Blockquote.Content whiteSpace='pre-line'>
            {recipe.instructions[0]}
          </Blockquote.Content>
          <Blockquote.Caption>
            - Enjoy!
          </Blockquote.Caption>
        </Blockquote.Root>
      </VStack>
    </VStack>
  );
}

export default ViewRecipe;