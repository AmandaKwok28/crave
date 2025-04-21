import { Button, Flex, Stack } from "@chakra-ui/react"
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
        await runPartyRecommendedAlgo(partyId);
        const partyrecs: PartyRecommendationType[] = await fetchPartyRecs(shareLink);
        setPartyRecs(partyrecs);
        setShowRecs(true);
        return <PartyRecs partyRecs={partyrecs}/>
    }

    return (
        <Flex> 
            <Stack >
                {showRecs && <PartyRecs partyRecs={partyRecs}/>}
                <Button 
                    variant="subtle" 
                    color="white" 
                    border="non"
                    bg="blue.400"
                    onClick={handleShowRecs}
                    >
                    Show Party Recommendations
                </Button>
            </Stack>
            
        </Flex>
    )
}

export default PartyRecButton;