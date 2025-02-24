import { API_URL } from "@/env";
import { $user, clearUser, setUser } from "@/lib/store";
import { useStore } from "@nanostores/react";

export function useAuth() {
  const user = useStore($user);

  async function getUser() {
    const res = await fetch(`${API_URL}/get-user`, {
      credentials: 'include'
    });

    if (!res.ok) {
      clearUser();
      return;
    }

    const json = await res.json();
    setUser(json['data']);
  }

  async function register(email: string, password: string, name: string, school: string, year: number) {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        email,
        password,
        name,
        school,
        year
      })
    });

    if (!res.ok) {
      clearUser();
      return;
    }

    const json = await res.json();
    setUser(json['data']);
  }

  return {
    user,
    getUser,
    register
  }
}
