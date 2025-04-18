
import { fetchComments } from "@/data/comments-api";
import { $comments, setComments } from "@/lib/store";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

const useQueryComments = (recipeId: number) => {
  const comments = useStore($comments);

  const loadComments = async () => {
    try {
      const fetchedComments = await fetchComments(recipeId);
      setComments(fetchedComments);
    } catch {
      setComments([]);
    }
  };

  useEffect(() => { 
    loadComments();
  }, [recipeId]);

  return { comments };
};

export default useQueryComments;