import { RatingType, RecipeType } from "@/data/types";
import { $router } from "@/lib/router";
import { Card, Button, Image, Text, Tag, Box, HStack } from "@chakra-ui/react";
import { redirectPage } from "@nanostores/router";
import { Avatar, AvatarGroup } from "@chakra-ui/react"
import { Bookmark, Heart } from "lucide-react";
import { bookmarkRecipe, likeRecipe, unbookmarkRecipe, unlikeRecipe } from "@/data/api";
import { useRating } from "@/hooks/ratings/use-rating";
import { useStore } from "@nanostores/react";
import { $isMobile, setRecipeBookmark, setRecipeLike, setRecipeUnbookmark, setRecipeUnLike } from "@/lib/store";

const RecipeCard = ({ 
  recipe,
}: { 
  recipe: RecipeType,
}) => {

  const { updateUserRating } = useRating();
  const isMobile = useStore($isMobile);

  const likeCallback = () => {
    if (!recipe) {
      return;
    }

    if (recipe.liked) {
      unlikeRecipe(recipe.id)
        .then(() => setRecipeUnLike(recipe))
        .catch(console.error);
      updateUserRating(recipe.authorId, RatingType.UNLIKE);  // update user rating
    } else {
      likeRecipe(recipe.id)
        .then(() => setRecipeLike(recipe))
        .catch(console.error);
      updateUserRating(recipe.authorId, RatingType.LIKE);

    }
  }

  const bookmarkCallback = () => {
    if (!recipe) {
      return;
    }

    if (recipe.bookmarked) {
      unbookmarkRecipe(recipe.id)
        .then(() => setRecipeUnbookmark(recipe))
        .catch(console.error);
      updateUserRating(recipe.authorId, RatingType.UNBOOKMARK);
    } else {
      bookmarkRecipe(recipe.id)
        .then(() => setRecipeBookmark(recipe))
        .catch(console.error);
      updateUserRating(recipe.authorId, RatingType.BOOKMARK);
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
    <Card.Root 
      w={isMobile ? "150px" : "300px"} 
      minH={isMobile ? "200px" : "400px"}  // Changed from fixed h to minH
      overflow="hidden" 
      borderRadius="20px"
    >
        <Image 
        src={recipe.image ? recipe.image : '/img_placeholder.jpg'}
        alt="Default Recipe Image" 
        maxW="100vw" 
        height={isMobile ? "15vh" : "20vh"} 
        objectFit="cover" 
        />
      <Card.Body gap="1" p={isMobile ? 2 : 4}>
        <Card.Title>
          <Text textStyle={isMobile ? "xs" : "lg"} fontWeight="medium" letterSpacing="tight" fontSize={isMobile ? "xs" : "md"}> 
            {recipe.title}
          </Text>
        </Card.Title>
        <Box display="flex" alignItems="center" gap="1" ml={isMobile ? "-4px" : "-6px"}>
          <AvatarGroup>
            <Avatar.Root size={isMobile ? "2xs" : "xs"} variant="subtle">
              <Avatar.Fallback name={`${recipe.author ? recipe.author.name : 'You'}`} />
              <Avatar.Image />
            </Avatar.Root>
          </AvatarGroup>
          <Text textStyle={isMobile ? "xs" : "sm"} color="gray" fontSize={isMobile ? "10px" : "sm"}>
            {recipe.author ? `@${recipe.author.name}` : "You"}
          </Text>
        </Box>
  
        <Box>
          {!isMobile && (
            <Text lineClamp="1" textStyle="sm">
              {recipe.description}
            </Text>
          )}
  
          <Box flexWrap="true" spaceX="2" mt={isMobile ? 1 : 2}>
            {recipe.cuisine && (
              <Tag.Root 
                size={isMobile ? "sm" : "lg"} 
                w="fit-content" 
                borderRadius="10px" 
                colorPalette={"blue"}
                m={isMobile ? "0.5" : "1"}
              >
                <Tag.Label fontSize={isMobile ? "9px" : "inherit"}>
                  {capitalizeFirstLetter(recipe.cuisine)}
                </Tag.Label>
              </Tag.Root>
            )}
  
            {recipe.price && (
              <Tag.Root 
                size={isMobile ? "sm" : "lg"} 
                w="fit-content" 
                borderRadius="10px" 
                colorPalette={"green"}
                m={isMobile ? "0.5" : "1"}
              >
                <Tag.Label fontSize={isMobile ? "9px" : "inherit"}>
                  {priceMap[recipe.price]}
                </Tag.Label>
              </Tag.Root>
            )}
  
            {recipe.prepTime && (
              <Tag.Root 
                size={isMobile ? "sm" : "lg"} 
                w="fit-content" 
                borderRadius="10px" 
                colorPalette={"purple"}
                m={isMobile ? "0.5" : "1"}
              >
                <Tag.Label fontSize={isMobile ? "9px" : "inherit"}>
                  {`${recipe.prepTime} min`}
                </Tag.Label>
              </Tag.Root>
            )}
          </Box>
        </Box>
      </Card.Body>
      <Card.Footer p={isMobile ? 2 : 4}>
        <HStack justify='space-between' alignItems='center' w='full'>
          <Button 
            variant="ghost" 
            onClick={handleSeeMore}
            size={isMobile ? "xs" : "md"}
            fontSize={isMobile ? "10px" : "inherit"}
            px={isMobile ? 2 : 4}
          >
            See More
          </Button>
  
          <HStack gap={isMobile ? 0 : 2}>
            <Button
              variant='ghost'
              color={recipe.liked ? 'red.400' : 'gray.600'}
              onClick={likeCallback}
              size={isMobile ? "xs" : "md"}
              p={isMobile ? 1 : 2}
              minW={isMobile ? "auto" : undefined}
            >
              {isMobile ? "" : recipe.likes} <Heart size={isMobile ? 14 : 20} />
            </Button>
  
            <Button
              variant='ghost'
              color={recipe.bookmarked ? 'blue.400' : 'gray.600'}
              onClick={bookmarkCallback}
              size={isMobile ? "xs" : "md"}
              p={isMobile ? 1 : 2}
              minW={isMobile ? "auto" : undefined}
            >
              <Bookmark size={isMobile ? 14 : 20} />
            </Button>
          </HStack>
        </HStack>
      </Card.Footer>
    </Card.Root>
  );
};

export default RecipeCard;
