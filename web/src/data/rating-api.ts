import { API_URL } from "@/env";
import { RatingType, UserType } from "./types";

// fetch the rating for a specific user
export const fetchRating = async (id: string): Promise<number> => {
    const response = await fetch(`${API_URL}/${id}/rating`, {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error(`API request failed! with status: ${response.status}`);
    }

    const { rating }: { rating: number } = await response.json();
    return rating;
};


export const updateRating = async (
    id: string, 
    type: RatingType
): Promise<UserType>  => {
    const response = await fetch(`${API_URL}/${id}/rating`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
            type
        }),
    });

    if (!response.ok) {
        throw new Error(`API request failed! with status: ${response.status}`);
    }

    const { user }: { user: UserType } = await response.json();
    return user;
};



