import NavBar from "@/components/layout/navBar";
import { fetchParty } from "@/data/api";
import { PartyType } from "@/data/types";
import { ButtonGroup, Center, Flex, Separator, Spinner, Text } from "@chakra-ui/react";
import { SetStateAction, useEffect, useState } from "react";
import AddPartyPrefrencesForm from "./addPartyPrefrencesForm";
import DeletePartyButton from "@/components/party/deletePartyButton";
import { useAuth } from "@/hooks/use-auth";
import LeavePartyButton from "@/components/party/leavePartyButton";
import PartyMembers from "@/components/party/partyMembers";
import PartyRecButton from "@/components/party/partyRecButton";

// Party page
const ViewParty = ({ share_link }: { 
  share_link: string; 
}) => {
  const [ party, setParty ] = useState<PartyType | null>();
  const [ refresh, setRefresh ] = useState<boolean>(true);
  const { user } = useAuth()

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
                        mt="7vh"
                    >
                        {party.name}
                    </Text>
                    <Separator w='50rem' maxW='100%' size="sm" mt="2"/>
                    <Text
                        textStyle="4xl"
                        textAlign="left"
                        fontWeight="bold"
                        mt="1vh"
                    >
                      Party Share Link:
                    </Text>
                    <Text
                        textStyle="3xl"
                        textAlign="left"
                        mt="1vh"
                    >
                      {`http://localhost:5173/party/`}{party.shareLink}
                    </Text>
                    <Separator w='50rem' maxW='100%' size="sm" mt="2"/>
                    <Text
                        textStyle="3xl"
                        textAlign="left"
                        mt="1vh"
                    >
                      Recomended Recipes:
                    </Text>
                    <PartyRecButton shareLink={party.shareLink} />
                    <Separator w='50rem' maxW='100%' size="sm" mt="2"/>
                    <Text
                        textStyle="2xl"
                        textAlign="left"
                        mt="1vh"
                    >
                       Current Party Members:
                    </Text>
                      <PartyMembers partyMembers={party.members}/>
                </Flex>
            </Flex>

            <ButtonGroup m="8" position="fixed" bottom="3%" right="2%" gap="4" >
              {party.host.id === user.id && (
                <DeletePartyButton party_id={party.id} />
              )}
              {party.host.id != user.id && (
                <LeavePartyButton party_id={party.id} user_id={user.id} />
              )}
            </ButtonGroup>
        </Flex>
      )

  } 
}

export default ViewParty;