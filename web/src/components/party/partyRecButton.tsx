import { Button, Flex } from "@chakra-ui/react"
import { fetchPartyRecs, runPartyRecommendedAlgo } from "@/data/api";
import { PartyRecommendationType, PartyType } from "@/data/types";
import PartyRecs from "./recommendedPartyRecipes";
import { useState } from "react";

const PartyRecButton = ({party}:{party: PartyType}) => {
    const [showRecs, setShowRecs] = useState<boolean>(false);
    const [ partyRecs, setPartyRecs ] = useState<PartyRecommendationType[]>([]);
    const partyId = party.id;
    const shareLink = party.shareLink;

    const handleShowRecs = async () => {
        runPartyRecommendedAlgo(partyId);
        const partyrecs: PartyRecommendationType[] = await fetchPartyRecs(shareLink);
        setPartyRecs(partyrecs);
        setShowRecs(true);
        return <PartyRecs partyRecs={partyrecs}/>
    }

    return (
        <Flex> 
            {showRecs && <PartyRecs partyRecs={partyRecs}/>}
            {!showRecs && <Button 
                variant="subtle" 
                color="white" 
                border="non"
                bg="blue.400"
                onClick={handleShowRecs}
                >
                Show Party Recommendations
            </Button>} 
        </Flex>
    )
}

export default PartyRecButton;