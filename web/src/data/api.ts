import { UserType } from "./types";
import { API_URL } from "@/env";

// Fetch all users
export const fetchUsers = async (): Promise<UserType[]> => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
      throw new Error(`API request failed! with status: ${response.status}`);
    }
    const data: UserType[] = await response.json();
    console.log(data);
    return data;
};