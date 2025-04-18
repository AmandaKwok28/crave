import { API_URL } from "@/env";
import { CommentType } from "./types";

// Fetch all comments for a given recipe
export const fetchComments = async (recipe_id: string | number): Promise<CommentType[]> => {
    const response = await fetch(`${API_URL}/recipe/${recipe_id}/comments`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(`API request failed! with status: ${response.status}`);
    }
    const comments: CommentType[] = await response.json();
    return comments;
  };
  
  // Create comment on a recipe
  export const createComment = async (recipe_id: string | number, content: string, userId: string): Promise<CommentType> => {
    const response = await fetch(`${API_URL}/recipe/${recipe_id}/comments`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({
        content,
        id: recipe_id,
        authorId: userId,
      }),
    });
    if (!response.ok) {
      throw new Error(`API request failed! with status: ${response.status}`);
    }
    const { comment } : { comment: CommentType } = await response.json();
    return comment;
  };
  
  // Delete comment on a recipe
  export const deleteComment = async (recipe_id: string | number, commentId: number) : Promise<boolean> => {
    const response = await fetch(`${API_URL}/recipe/${recipe_id}/comments/${commentId}`, {
      credentials: 'include',
      method: 'DELETE'
    });
  
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return true;
  };
  
  