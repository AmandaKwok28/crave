import { Card, Button, Image, Text } from "@chakra-ui/react";


const RecipeCard = () => {
  return (
    <Card.Root width="320px" maxH="500px" overflow="hidden">
        <Image 
        src={"fallback.png"}
        alt="Default Recipe Image" 
        borderRadius="md" 
        maxW="100vw" 
        height="25vh" 
        objectFit="cover" 
        />
      <Card.Body gap="2">
        <Card.Title>
            <Text textStyle="xl" fontWeight="medium" letterSpacing="tight"> 
                Recipe Name
            </Text>
        </Card.Title>
        <Card.Description>
            @JaneDoe
        </Card.Description>
        <Card.Description>
            <Text lineClamp="3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis
            </Text>
        </Card.Description>
      </Card.Body>
      <Card.Footer gap="2">
        <Button variant="ghost">See More</Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default RecipeCard;
