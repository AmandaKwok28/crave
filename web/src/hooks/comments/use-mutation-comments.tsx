import { createComment, deleteComment } from "@/data/api";
import { $comments, setComments } from "@/lib/store";
import { useStore } from "@nanostores/react";

const useMutationComment = (recipeId: number) => {
  const comments = useStore($comments);

  const addComment = async (content: string, userId: string) => {
    if (!content.trim()) return;

    try {
      const newComment = await createComment(recipeId, content, userId);
      setComments([...comments, newComment]);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const removeComment = async (commentId: number) => {
    try {
      await deleteComment(recipeId, commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return { addComment, removeComment };
};

export default useMutationComment;
