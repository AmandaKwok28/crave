import { fetchDrafts, fetchRecipes } from "@/data/api";
import { $drafts, $recipes, setDrafts, setRecipes } from "@/lib/store";
import { useStore } from "@nanostores/react";
import { useAuth } from "./use-auth";
import { useEffect } from "react";

const useQueryRecipes = () => {
    const { user } = useAuth();
    const recipes = useStore($recipes);
    const drafts = useStore($drafts);

    const loadRecipes = () => {
      fetchRecipes()
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

    useEffect(() => {
      loadRecipes();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
      recipes,
      drafts
    }
}

export default useQueryRecipes;


