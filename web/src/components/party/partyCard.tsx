import { PartyType } from "@/data/types";
import { $router } from "@/lib/router";
import { Card, Button, Image, Text, Box, HStack } from "@chakra-ui/react";
import { redirectPage } from "@nanostores/router";
import { Avatar, AvatarGroup } from "@chakra-ui/react"

const PartyCard = ({ party }: { party: PartyType }) => {
  //const { loadParty } = useQueryParty(); TODO: use query party hook to get the party

  const handleSeeMore = () => {
    const id = party.id;
    //redirectPage($router, 'editDraft', { draft_id: id });
  }
  return (
    <Card.Root 
      width="300px" 
      maxH="400px" 
      overflow="hidden" 
      borderRadius="20px"
      >
      <Card.Body gap="1">
        <Card.Title>
          <Text textStyle="lg" fontWeight="medium" letterSpacing="tight"> 
            {party.name}
          </Text>
        </Card.Title>
        <Box display="flex" alignItems="center" gap="1" ml="-6px">
          <AvatarGroup>
            <Avatar.Root size="xs" variant="subtle">
              <Avatar.Fallback name={`${party.host ? party.host.name : 'You'}`} />
              <Avatar.Image />
            </Avatar.Root>
          </AvatarGroup>
          <Text textStyle="sm" color="gray">{party.host ? `@${party.host.name}` : "You"}</Text>
        </Box>

      </Card.Body>
      <Card.Footer>
        <HStack justify='space-between' alignItems='center' w='full'>
          <Button 
            variant="ghost" 
            onClick={handleSeeMore}>
            See More
          </Button>
        </HStack>
      </Card.Footer>
    </Card.Root>
  );
};

export default PartyCard;
