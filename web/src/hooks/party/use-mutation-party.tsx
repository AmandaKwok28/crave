import { addPartyMember, createNewParty, deleteParty, patchPartyPrefrences } from "@/data/api";
import { Cuisine, Difficulty, PartyType, Price } from "@/data/types";
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
            var date: Date = new Date();
            date.setDate(date.getDate() + 30);
            const party: PartyType = await createNewParty(title, date.toLocaleDateString());
            addParty(party);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new Error("Error adding a new Party")
        }
    };

    const updatePartyPrefrences = async (
        id: string,
        availableTime: number,
        preferredCuisines: Cuisine[],
        aggregatedIngredients: string[],
        excludedAllergens: string[],
        preferredPrice: Price,
        preferredDifficulty: Difficulty,
    ) => {
        try {
            if (!availableTime || !preferredCuisines || !aggregatedIngredients || !excludedAllergens || !preferredPrice || !preferredDifficulty) {
                throw new Error("All field must have content to publish!")
            }
            const newPartyPrefs = await patchPartyPrefrences(
                id, 
                availableTime,
                preferredCuisines,
                aggregatedIngredients,
                excludedAllergens,
                preferredPrice,
                preferredDifficulty,
            );
            return newPartyPrefs;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new Error("Error updating party prefrences")
        }
    }

    const joinParty = async (
        share_link: string, 
        ingredients: string[], 
        cookingAbility: Difficulty 
    ) => {
    try {
        if (!ingredients || !cookingAbility) {
            throw new Error("Title must have ability and ingredients to join!")
        }
        const newMember = await addPartyMember(share_link, ingredients, cookingAbility);
        return newMember;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        throw new Error("Error joining the Party")
    }
};

    return {
        addNewParty,
        deletePartyById,
        updatePartyPrefrences,
        joinParty,
    }
}

export default useMutationParty;