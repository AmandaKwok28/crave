import { useState, useEffect } from 'react';
import { RecipeType } from '@/data/types';
import { fetchSimilarRecipes } from '@/data/api';

export default function useSimilarRecipes(recipeId: number, limit: number = 10) {
    const [similarRecipes, setSimilarRecipes] = useState<RecipeType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
  
    useEffect(() => {
      const getSimilarRecipes = async () => {
        if (!recipeId) return;
        
        setLoading(true);
        try {
          const recipes = await fetchSimilarRecipes(recipeId, limit);
          setSimilarRecipes(recipes);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to fetch similar recipes'));
          console.error('Error fetching similar recipes:', err);
        } finally {
          setLoading(false);
        }
      };
  
      getSimilarRecipes();
    }, [recipeId, limit]);
  
    return { similarRecipes, loading, error };
  }