import { updateRating } from "@/data/rating-api"
import { RatingType } from "@/data/types"
import { setUser } from "@/lib/store";

export function useRating() {

    // function to update the user rating
    async function updateUserRating(id: string, type: RatingType) {
        const updatedUser = await updateRating(id, type);
        setUser(updatedUser);
    }

    return {
        updateUserRating
    }
}