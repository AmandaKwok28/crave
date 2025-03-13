import { fetchAllergen, fetchDrafts, fetchRecipes } from "@/data/api";
import { $drafts, $recipes, setDrafts, setRecipes, $filters, $searchTerm, setAllergenTable, $allergenTable } from "@/lib/store";
import { useStore } from "@nanostores/react";
import { useAuth } from "./use-auth";
import { useEffect } from "react";

const useQueryRecipes = (ignoreFilters: boolean = false) => {
    const { user } = useAuth();
    const recipes = useStore($recipes);
    const drafts = useStore($drafts);
    const filters = useStore($filters);
    const searchTerm = useStore($searchTerm);
    const allergenTable = useStore($allergenTable);

    const loadRecipes = () => {
      fetchRecipes(ignoreFilters ? {} : filters, searchTerm)
        .then((recipes) => setRecipes(recipes))
        .catch(() => setRecipes([]));
      
      if (user.id) {
        fetchDrafts(user.id)
          .then((drafts) => setDrafts(drafts))
          .catch(() => setDrafts([]));
      } else {
        setDrafts([]);
      }
    };

    const loadAllergens = async () => {
      try {
        const data = await fetchAllergen();  
        setAllergenTable(data);  
      } catch (error) {
        console.error("⚠️ Error fetching allergens:", error);
        setAllergenTable([]); 
      }
    };

    useEffect(() => {
      loadRecipes();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, searchTerm]);

    useEffect(() => {
      loadAllergens();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
      recipes,
      drafts,
      allergenTable,
      loadAllergens
    }
}

export default useQueryRecipes;


