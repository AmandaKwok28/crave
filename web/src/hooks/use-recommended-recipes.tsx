import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchUserRecommendedRecipes } from '@/data/api';
import { RecipeType } from '@/data/types';
import { useAuth } from "./use-auth";
import { useStore } from '@nanostores/react';
import { $likes, $bookmarks } from '@/lib/store';

interface UseRecommendedRecipesReturn {
  recommendedRecipes: RecipeType[];
  isLoading: boolean;
  error: Error | null;
}

export default function useRecommendedRecipes(limit: number = 10): UseRecommendedRecipesReturn {
  const [recommendedRecipes, setRecommendedRecipes] = useState<RecipeType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const isFirstMount = useRef(true);
  const isFetching = useRef(false);

  const { user } = useAuth();
  // Only track IDs of likes and bookmarks, not the entire objects
  const likeIds = useStore($likes)?.map(like => like.id).join(',') || '';
  const bookmarkIds = useStore($bookmarks)?.map(bookmark => bookmark.id).join(',') || '';

  const fetchRecommendations = useCallback(async () => {
    // Prevent concurrent fetches
    if (isFetching.current) return;
    
    if (!user?.id) {
      setRecommendedRecipes([]);
      setIsLoading(false);
      return;
    }
    
    try {
      // Only show loading on first load
      if (isFirstMount.current) {
        setIsLoading(true);
      }
      
      isFetching.current = true;
      setError(null);
      const recipes = await fetchUserRecommendedRecipes(limit);
      setRecommendedRecipes(recipes);
      isFirstMount.current = false;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch recommended recipes'));
      console.error('Error fetching recommended recipes:', err);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, [limit, user?.id]);

  // Create a stable dependency that only changes when relevant IDs change
  const stableDependency = useCallback(() => {
    return `${limit}-${user?.id}-${likeIds}-${bookmarkIds}`;
  }, [limit, user?.id, likeIds, bookmarkIds]);

  useEffect(() => {
    fetchRecommendations();
  }, [stableDependency, fetchRecommendations]);

  return {
    recommendedRecipes,
    isLoading,
    error,
  };
}