import { fetchRecipeDrafts } from "@/data/api";
import { $drafts, setDrafts } from "@/lib/store";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

const useQueryDrafts = (id: string) => {
    const drafts = useStore($drafts);
    const loadDrafts = async () => {
        try {
          const fetchedDrafts = await fetchRecipeDrafts(id);
          setDrafts([...fetchedDrafts]);
        } catch (error) {
        }
      };

    useEffect(() => {
      loadDrafts();
    }, [])

    return {
        drafts,
    }
}

export default useQueryDrafts;


