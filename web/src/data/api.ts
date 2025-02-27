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
export const login = async ( email: string, password: string ): Promise<UserType> => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
      })
    });

    if (!res.ok) {
      // ZodError
      if (res.status === 400) {
        const json = await res.json();
        throw new Error(JSON.stringify(json['error']));
      }

      throw new Error(`Request failed with status ${res.status}`);
    }

    const { data }: { data: UserType } = await res.json();
    return data;
}