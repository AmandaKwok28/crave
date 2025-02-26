import { login } from "@/data/api";
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
      return;
    }

    const json = await res.json();
    setUser(json['data']);
  }

  async function signIn(
    username: string,
    password: string
  ) {
    try {
      const user = await login(username, password);
      setUser(user);
    } catch (error) {
      clearUser();
      return;
    }
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
    signIn,
    logout
  }
}
