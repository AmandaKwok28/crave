import { Button, Flex, Spinner, Stack } from "@chakra-ui/react"
import { fetchPartyRecs, runPartyRecommendedAlgo } from "@/data/api";
import { PartyRecommendationType, PartyType } from "@/data/types";
import PartyRecs from "./recommendedPartyRecipes";
import { useState } from "react";

const PartyRecButton = ({party, loadRecipes} :{party: PartyType, loadRecipes: any}) => {
    const [showRecs, setShowRecs] = useState<boolean>(false);
    const [ partyRecs, setPartyRecs ] = useState<PartyRecommendationType[]>([]);
    const partyId = party.id;
    const shareLink = party.shareLink;
    const [ loading, setLoading ] = useState<boolean>(false);

    const handleShowRecs = async () => {
        setLoading(true);
        await runPartyRecommendedAlgo(partyId);
        const partyrecs: PartyRecommendationType[] = await fetchPartyRecs(shareLink);
        setPartyRecs(partyrecs);
        setLoading(false);
        setShowRecs(true);
        return <PartyRecs partyRecs={partyrecs} loadRecipes={loadRecipes}/>
    }

    return (
        <Flex> 
            <Stack >
                {loading && <Spinner size="xl" color= "real.500"/> }
                {!loading && showRecs && <PartyRecs partyRecs={partyRecs} loadRecipes={loadRecipes}/> }
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