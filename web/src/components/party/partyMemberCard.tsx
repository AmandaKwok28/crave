import { PartyMemberType } from "@/data/types"
import { Card, Text, Box } from "@chakra-ui/react";
import { Avatar, AvatarGroup } from "@chakra-ui/react"

const PartyMemberCard = ({ partyMember }: { partyMember: PartyMemberType }) => {

  return (
    <Card.Root 
      width="300px" 
      maxH="150px" 
      overflow="hidden" 
      borderRadius="20px"
      >
      <Card.Body gap="1">
        <Card.Title>
          <Text textStyle="lg" fontWeight="medium" letterSpacing="tight"> 
            {partyMember.user.name}
          </Text>
        </Card.Title>
        <Box display="flex" alignItems="center" gap="1" ml="-6px">
          <AvatarGroup>
            <Avatar.Root size="xs" variant="subtle">
              <Avatar.Fallback name={`${partyMember.user ? partyMember.user.name : 'You'}`} />
              <Avatar.Image />
            </Avatar.Root>
          </AvatarGroup>
          <Text textStyle="sm" color="gray">{partyMember.user ? `@${partyMember.user.name}` : "You"}</Text>
        </Box>
      </Card.Body>
    </Card.Root>
  );
};

export default PartyMemberCard;
