import { fetchRecipes } from "@/data/api";
import { $recipes, setRecipes } from "@/lib/store";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

const useQueryRecipes = () => {
    const recipes = useStore($recipes);
    const loadRecipes = async () => {
        try {
          const fetchedRecipes = await fetchRecipes();
          setRecipes([...fetchedRecipes]);
        } catch (error) {
        }
      };

    useEffect(() => {
      loadRecipes();
    }, [])

    return {
        recipes,
    }
}

export default useQueryRecipes;


