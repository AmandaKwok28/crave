import { useState, useEffect, useCallback } from 'react';
import { fetchUserRecommendedRecipes } from '@/data/api';
import { RecipeType } from '@/data/types';

interface UseRecommendedRecipesReturn {
  recommendedRecipes: RecipeType[];
  isLoading: boolean;
  error: Error | null;
  refreshRecommendations: () => Promise<void>;
}

export default function useRecommendedRecipes(): UseRecommendedRecipesReturn {
  const [recommendedRecipes, setRecommendedRecipes] = useState<RecipeType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecommendations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const recipes = await fetchUserRecommendedRecipes();
      setRecommendedRecipes(recipes);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch recommended recipes'));
      console.error('Error fetching recommended recipes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const refreshRecommendations = useCallback(async () => {
    await fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendedRecipes,
    isLoading,
    error,
    refreshRecommendations
  };
}