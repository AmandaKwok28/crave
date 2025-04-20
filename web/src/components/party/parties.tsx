import { PartyType } from "@/data/types";
import { Flex, Text } from "@chakra-ui/react";
import PartyCard from "./partyCard";

const Parties = ({parties}:{parties:PartyType[]}) => {

    if (parties.length === 0) {
        return (
            <Text mt='14' fontSize='xl'>No current parties found, create or join one to get started!</Text>
        );
    }

    return (
        <Flex gap="10" wrap="wrap" justifyContent="center" w="full">
            {parties.map((card:PartyType) => (
                <PartyCard key={card.id} party={card} /> 
            ))}
        </Flex>
    )
}

export default Parties;