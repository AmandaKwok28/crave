import { updateRating } from "@/data/rating-api"
import { RatingType } from "@/data/types"
import { useAuth } from "../use-auth";
import { setUser } from "@/lib/store";

export function useRating() {
    const { user } = useAuth();

    // function to update the user rating
    async function updateUserRating(id: string, type: RatingType) {
        const updatedUser = await updateRating(id, type);
        if (updatedUser.id === user.id) {
            setUser(updatedUser);              // temporary fix... should be able to fix this later...
        }
        // setUser(updatedUser);
    }

    return {
        updateUserRating
    }
}