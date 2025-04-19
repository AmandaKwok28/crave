import { useEffect, useState } from "react";
import { fetchFollowers, fetchFollowing, fetchUser } from "@/data/api";
import { UserType } from "@/data/types";
import { $viewingUser, setViewingUser } from "@/lib/store";
import { useStore } from "@nanostores/react";

const useQueryUser = (userId: string) => {
  const [followers, setFollowers] = useState<UserType[]>([]);
  const [following, setFollowing] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const viewingUser = useStore($viewingUser);

  const getUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchUser(userId);
      setViewingUser(data);

      const [followersData, followingData] = await Promise.all([
        fetchFollowers(userId),
        fetchFollowing(userId),
      ]);

      setFollowers(followersData);
      setFollowing(followingData);
      
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUser();
  }, [userId]);

  return { viewingUser, followers, following, loading, error, refetch: getUser };
};

export default useQueryUser;
