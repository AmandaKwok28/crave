import { RecipeType } from "@/data/types";
import { $router } from "@/lib/router";
import { Card, Button, Image, Text } from "@chakra-ui/react";
import { redirectPage } from "@nanostores/router";


const RecipeCard = ({ recipe }: { recipe: RecipeType }) => {
  const handleSeeMore = () => {
    const id = recipe.id;

    if (recipe.published) {
      redirectPage($router, 'recipe', { recipe_id: id });
    } else {
      redirectPage($router, 'editDraft', { draft_id: id });
    }
  }

  return (
    <Card.Root width="320px" maxH="500px" overflow="hidden">
        <Image 
        src={"/fallback.png"}
        alt="Default Recipe Image" 
        borderRadius="md" 
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
            {recipe.author ? recipe.author.name : "hi"}
        </Card.Description>
        <Card.Description>
            <Text lineClamp="3">
            {recipe.description}
            </Text>
        </Card.Description>
      </Card.Body>
      <Card.Footer gap="2">
        <Button variant="ghost" onClick={handleSeeMore}>
          See More
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default RecipeCard;
