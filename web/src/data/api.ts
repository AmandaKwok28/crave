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


// login
export const login = async ( username: string, password: string ): Promise<UserType> => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password,
      })
    });

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const { user }:{user: UserType} = await res.json();
    return user;
}