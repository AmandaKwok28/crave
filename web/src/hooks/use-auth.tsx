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

  async function register(
    email: string,
    password: string,
    name: string,
    school: string,
    major: string)
  {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        name,
        school,
        major
      })
    });

    if (!res.ok) {
      clearUser();
      
      // ZodError, throw specific errors
      if (res.status === 400) {
        const json = await res.json();
        throw new Error(JSON.stringify(json['error']));
      }

      return;
    }

    const json = await res.json();
    setUser(json['data']);
  }

  async function logout() {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!res.ok) {
      return;
    }

    clearUser();
  }

  return {
    user,
    getUser,
    register,
    logout
  }
}
