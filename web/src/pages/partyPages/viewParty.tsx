import NavBar from "@/components/layout/navBar";
import { fetchParty } from "@/data/api";
import { PartyType } from "@/data/types";
import { Center, Flex, Separator, Spinner, Text } from "@chakra-ui/react";
import { SetStateAction, useEffect, useState } from "react";
import AddPartyPrefrencesForm from "./addPartyPrefrencesForm";
import { API_URL } from "@/env";

// Recipe page
const ViewParty = ({ share_link }: { 
  share_link: string; 
}) => {
  const [ party, setParty ] = useState<PartyType | null>();
  const [ refresh, setRefresh ] = useState<boolean>(true);

  useEffect(() => {
    if (!refresh) {
      return;
    }
    setRefresh(false);

    fetchParty(share_link)
      .then((rec: SetStateAction<PartyType | null | undefined>) => setParty(rec))
      .catch(console.error);
  }, [share_link, refresh]);

  if (!party) {
    return (
      <Flex className="flex flex-col">
        <NavBar/>
        <Center w="100vw" h="100vh">
          {party === null && <Text>Party not found</Text>}
          {party === undefined && <Spinner />}
        </Center>
      </Flex>
    );
  }
  if(!party.isUserMember) {
    return (
        <AddPartyPrefrencesForm party={party} />
    )
  } else {
    return (
        <Flex direction="column" alignContent="flex-start">
            <NavBar/>
            <Flex direction="row" width="full">
                <Flex direction="column" alignItems="flex-start" p="4" ml="2vw" gap='4'>
                    <Text
                        textStyle="5xl"
                        textAlign="left"
                        fontWeight="bold"
                        mt="5vh"
                    >
                        {party.name}
                    </Text>
                    <Separator w='50rem' maxW='80%' size="sm" mt="2"/>
                    <Text
                        textStyle="5xl"
                        textAlign="left"
                        fontWeight="bold"
                        mt="5vh"
                    >
                        {`http://localhost:5173/party/`}{party.shareLink}
                    </Text>
                </Flex>
            </Flex>
        </Flex>
      )

  } 
}

export default ViewParty;