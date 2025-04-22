import { fetchParties } from "@/data/api";
import { $parties, setParties } from "@/lib/store";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

const useQueryParties = () => {
    const parties = useStore($parties);

    const loadParties = () => {
        fetchParties()
        .then((parties) => setParties(parties))
        .catch(() => setParties([]));
    };

    useEffect(() => {
      loadParties();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    });

    return {
      parties,
      loadParties,
    }
}

export default useQueryParties;


