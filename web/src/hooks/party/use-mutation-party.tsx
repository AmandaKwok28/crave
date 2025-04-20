import { createNewParty, deleteParty } from "@/data/api";
import { PartyType } from "@/data/types";
import { addParty, removeParty } from "@/lib/store";
//import { $parties, setParties } from "@/lib/store";

const useMutationParty = () => {

    const deletePartyById = async (party_id: string) => {
            await deleteParty(party_id);
            removeParty(party_id);
    };

    const addNewParty = async (
            title: string, 
        ) => {
        try {
            if (!title) {
                throw new Error("Title must have content to publish!")
            }
            const party: PartyType = await createNewParty(title, new Date().toLocaleDateString());
            addParty(party);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new Error("Error adding a new Party")
        }
    };

    return {
        addNewParty,
        deletePartyById,
    }
}

export default useMutationParty;