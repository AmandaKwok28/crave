import { fetchComments } from "@/data/api";
import { $comments, setComments } from "@/lib/store";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

const useQueryComments = (recipeId: number) => {
  const comments = useStore($comments);

  useEffect(() => {
    if (!recipeId) return;

    setComments([]);

    const loadComments = async () => {
      try {
        const fetchedComments = await fetchComments(recipeId);
        setComments(fetchedComments);
      } catch {
        setComments([]);
      }
    };

    loadComments();
  }, [recipeId]);

  return { comments };
};

export default useQueryComments;