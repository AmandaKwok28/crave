import { Button, Flex } from "@chakra-ui/react"
import { fetchPartyRecs } from "@/data/api";
import { PartyRecommendationType } from "@/data/types";
import PartyRecs from "./recommendedPartyRecipes";
import { useState } from "react";

const PartyRecButton = ({shareLink}:{shareLink: string}) => {
    const [showRecs, setShowRecs] = useState<boolean>(false);
    const [ partyRecs, setPartyRecs ] = useState<PartyRecommendationType[]>([]);

    const handleShowRecs = async () => {
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