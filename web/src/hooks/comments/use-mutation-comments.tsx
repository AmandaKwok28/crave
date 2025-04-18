import { createComment, deleteComment } from "@/data/comments-api";
import { addAComment, removeAComment } from "@/lib/store";

const useMutationComment = (recipeId: number) => {
  const addComment = async (content: string, userId: string) => {
    if (!content.trim()) return; 

    try {
      const newComment = await createComment(recipeId, content, userId);
      addAComment(newComment); 
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const removeComment = async (commentId: number) => {
    try {
      await deleteComment(recipeId, commentId);
      removeAComment(commentId); 
      console.log('just deleted!')
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return { addComment, removeComment };
};

export default useMutationComment;
