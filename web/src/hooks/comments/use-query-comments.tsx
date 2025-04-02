import { fetchComments } from "@/data/api";
import { $comments, setComments } from "@/lib/store";
import { useStore } from "@nanostores/react";
import { useEffect, useCallback } from "react";

const useQueryComments = (recipeId: number) => {
  const comments = useStore($comments);

  const loadComments = useCallback(async () => {
    if (!recipeId) return;

    setComments([]);

    try {
      const fetchedComments = await fetchComments(recipeId);
      setComments(fetchedComments);
    } catch {
      setComments([]);
    }
  }, [recipeId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return { comments, loadComments }; // Export loadComments
};

export default useQueryComments;