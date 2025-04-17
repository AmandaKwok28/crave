import { API_URL } from "@/env";

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




