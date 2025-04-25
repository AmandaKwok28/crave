import { fetchAllergen, fetchBookmarks, fetchDrafts, fetchLikes, fetchRecipes } from "@/data/api";
import { $drafts, $recipes, setDrafts, setRecipes, $filters, $searchTerm, setAllergenTable, $allergenTable, $likes, $bookmarks, setLikes, setBookmarks } from "@/lib/store";
import { useStore } from "@nanostores/react";
import { useAuth } from "./use-auth";
import { useEffect, useState } from "react";

const useQueryRecipes = (ignoreFilters: boolean = false) => {
    const { user } = useAuth();
    const recipes = useStore($recipes);
    const drafts = useStore($drafts);
    const likes = useStore($likes);
    const bookmarks = useStore($bookmarks);
    const filters = useStore($filters);
    const searchTerm = useStore($searchTerm);
    const allergenTable = useStore($allergenTable);

    const loadRecipes = () => {
      fetchRecipes(ignoreFilters ? {} : filters, searchTerm)
        .then((recipes) => setRecipes(recipes))
        .catch(() => setRecipes([]));
      
      if (user.id) {
        fetchDrafts()
          .then((drafts) => setDrafts(drafts))
          .catch(() => setDrafts([]));

        fetchLikes()
          .then((likes) => setLikes(likes))
          .catch(() => setLikes([]));

        fetchBookmarks()
          .then((bookmarks) => setBookmarks(bookmarks))
          .catch(() => setBookmarks([]));
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

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    useEffect(() => {
      const timeout = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
      }, 300); // debounce delay
    
      return () => clearTimeout(timeout);
    }, [searchTerm]);

    useEffect(() => {
      // console.log('here')
      loadRecipes();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, debouncedSearchTerm]);

    useEffect(() => {
      loadAllergens();
    }, [])

    return {
      recipes,
      drafts,
      likes,
      bookmarks,
      allergenTable,
      loadRecipes,
      loadAllergens
    }
}

export default useQueryRecipes;


