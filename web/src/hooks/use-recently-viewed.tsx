import { useState, useEffect, useCallback } from 'react';
import { fetchRecentlyViewed, markRecipeAsViewed } from '@/data/api';
import { RecipeType } from '@/data/types';

interface UseRecentlyViewedReturn {
  recentlyViewed: RecipeType[];
  isLoading: boolean;
  error: Error | null;
  markAsViewed: (recipeId: number) => Promise<void>;
  refreshRecentlyViewed: () => Promise<void>;
}

export default function useRecentlyViewed(): UseRecentlyViewedReturn {
  const [recentlyViewed, setRecentlyViewed] = useState<RecipeType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecipes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const recipes = await fetchRecentlyViewed();
      setRecentlyViewed(recipes);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch recently viewed recipes'));
      console.error('Error fetching recently viewed recipes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const markAsViewed = useCallback(async (recipeId: number) => {
    try {
      await markRecipeAsViewed(recipeId);
      // Optionally refresh the list after marking a recipe as viewed
      // await fetchRecipes();
    } catch (err) {
      console.error('Error marking recipe as viewed:', err);
      throw err;
    }
  }, []);

  const refreshRecentlyViewed = useCallback(async () => {
    await fetchRecipes();
  }, [fetchRecipes]);

  return {
    recentlyViewed,
    isLoading,
    error,
    markAsViewed,
    refreshRecentlyViewed
  };
}