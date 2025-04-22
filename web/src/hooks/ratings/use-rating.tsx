import { updateRating } from "@/data/rating-api"
import { RatingType } from "@/data/types"
import { setUser, setViewingUser } from "@/lib/store";
import { useAuth } from "../use-auth";

export function useRating() {
    const { user } = useAuth();

    // function to update the user rating
    async function updateUserRating(id: string, type: RatingType) {
        const updatedUser = await updateRating(id, type);
        if (updatedUser.id === user.id) {
            setUser(updatedUser);
        } else {
            setViewingUser(updatedUser);
        }
    }

    return {
        updateUserRating
    }
}