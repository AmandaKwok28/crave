import { RecipeType } from "@/data/types";
import { $router } from "@/lib/router";
import { Card, Button, Image, Text, Tag, Box, HStack } from "@chakra-ui/react";
import { redirectPage } from "@nanostores/router";
import { Avatar, AvatarGroup } from "@chakra-ui/react"
import { Bookmark, Heart } from "lucide-react";
import { bookmarkRecipe, likeRecipe, unbookmarkRecipe, unlikeRecipe } from "@/data/api";
import useQueryRecipes from "@/hooks/use-query-recipes";

const RecipeCard = ({ recipe }: { recipe: RecipeType }) => {
  // Whatever makes sense
  const { loadRecipes } = useQueryRecipes();

  const likeCallback = () => {
    if (!recipe) {
      return;
    }

    if (recipe.liked) {
      unlikeRecipe(recipe.id)
        .then(() => loadRecipes())
        .catch(console.error);
    } else {
      likeRecipe(recipe.id)
        .then(() => loadRecipes())
        .catch(console.error);
    }
  }

  const bookmarkCallback = () => {
    if (!recipe) {
      return;
    }

    if (recipe.bookmarked) {
      unbookmarkRecipe(recipe.id)
        .then(() => loadRecipes())
        .catch(console.error);
    } else {
      bookmarkRecipe(recipe.id)
        .then(() => loadRecipes())
        .catch(console.error);
    }
  }

  const handleSeeMore = () => {
    const id = recipe.id;

    if (recipe.published) {
      redirectPage($router, 'recipe', { recipe_id: id });
    } else {
      redirectPage($router, 'editDraft', { draft_id: id });
    }
  }

  const capitalizeFirstLetter = (str: string): string => 
    str[0].toUpperCase() + str.slice(1).toLowerCase();

  const priceMap: Record<string, string> = {
    "CHEAP": "$",
    "MODERATE": "$$",
    "PRICEY": "$$$",
    "EXPENSIVE": "$$$$"
  };

  return (
    <Card.Root width="370px" maxH="500px" overflow="hidden" borderRadius="20px">
        <Image 
        src={"/fallback.png"}
        alt="Default Recipe Image" 
        maxW="100vw" 
        height="25vh" 
        objectFit="cover" 
        />
      <Card.Body gap="2">
        <Card.Title>
          <Text textStyle="xl" fontWeight="medium" letterSpacing="tight"> 
            {recipe.title}
          </Text>
        </Card.Title>
        <Card.Description>
          <AvatarGroup>
            <Avatar.Root size="xs" variant="subtle">
              <Avatar.Fallback name={`${recipe.author ? recipe.author.name : 'You'}`} />
              <Avatar.Image />
            </Avatar.Root>
          </AvatarGroup>
            {recipe.author ? `${recipe.author.name}` : "You"}
        </Card.Description>
        <Card.Description>
            <Text lineClamp="3">
            {recipe.description}
            </Text>

            {/* For the recipe card: let's only display popular tags like price, allergens, and preptime */}
            <Box flexWrap="true" spaceX="2" mt="4">
            {/* {recipe.allergens.map((tag, index) => (
                  <Tag.Root key={index} variant="outline" size="lg" w="fit-content" borderRadius="10px">
                      <Tag.Label>{tag}</Tag.Label>
                  </Tag.Root>
            ))} */}
                {recipe.cuisine && (
                  <Tag.Root size="lg" w="fit-content" borderRadius="10px" colorPalette={"blue"}>
                    <Tag.Label>{capitalizeFirstLetter(recipe.cuisine)}</Tag.Label>
                  </Tag.Root>
                )}

                {recipe.price && (
                  <Tag.Root size="lg" w="fit-content" borderRadius="10px" colorPalette={"green"}>
                    <Tag.Label>{priceMap[recipe.price]}</Tag.Label>
                  </Tag.Root>
                )}

                {recipe.prepTime && (
                  <Tag.Root size="lg" w="fit-content" borderRadius="10px" colorPalette={"purple"}>
                    <Tag.Label>{`${recipe.prepTime} min`}</Tag.Label>
                  </Tag.Root>
                )}
            </Box>
        
        </Card.Description>
      </Card.Body>
      <Card.Footer>
        <HStack justify='space-between' alignItems='center' w='full'>
          <Button 
            variant="ghost" 
            onClick={handleSeeMore}>
            See More
          </Button>

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
        </HStack>
      </Card.Footer>
    </Card.Root>
  );
};

export default RecipeCard;
