import { useEffect, useState } from "react";
import { fetchUser } from "@/data/api";
import { UserType } from "@/data/types";

const useQueryUser = (userId: string | null) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    const getUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchUser(userId);
        setUser(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [userId]);

  return { user, loading, error };
};

export default useQueryUser;
