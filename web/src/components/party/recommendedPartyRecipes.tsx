import { PartyRecommendationType } from "@/data/types";
import { Flex, Text } from "@chakra-ui/react";
import RecipeCard from "../layout/recipeCard";

const PartyRecs = ({partyRecs}:{partyRecs: PartyRecommendationType[] }) => {

    const arr = Object.values(partyRecs);

    if (partyRecs.length === 0) {
        return (
            <Text mt='14' fontSize='xl'>No recommendations found, Please try again later!</Text> 
        );
    }

    return (
        <Flex gap="10" wrap="wrap" justifyContent="center" w="full">
            {arr.map((card:PartyRecommendationType) => (
                <RecipeCard key={card.id} recipe={card.recipe} /> 
            ))}
        </Flex>
    )
}

export default PartyRecs;