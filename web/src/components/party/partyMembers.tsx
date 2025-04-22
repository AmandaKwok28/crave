import { PartyMemberType } from "@/data/types";
import { Flex } from "@chakra-ui/react";
import PartyMemberCard from "./partyMemberCard";

const Parties = ({partyMembers}:{partyMembers:PartyMemberType[]}) => {

    return (
        <Flex gap="2" direction="column" justifyContent="center" w="full">
            {partyMembers.map((card:PartyMemberType) => (
                <PartyMemberCard key={card.id} partyMember={card} /> 
            ))}
        </Flex>
    )
}

export default Parties;