import { useEffect, useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { setFilters } from "@/lib/store";

const Prices = ({ defaultPrice }: { defaultPrice?: string | null }) => {
    const [selectedPrice, setSelectedPrice] = useState<string | null>(defaultPrice ?? null);

    // Update filters when selectedPrice changes
    useEffect(() => {
        const priceMap: Record<string, string | null> = {
            "$": "CHEAP",
            "$$": "MODERATE",
            "$$$": "PRICEY",
            "$$$$": "EXPENSIVE"
        };

        setFilters({ price: priceMap[selectedPrice ?? ""] ?? null });
    }, [selectedPrice]);

    const handleSelect = (price: string) => {
        setSelectedPrice(prev => (prev === price ? null : price)); // Toggle selection
    };

    return (
        <Flex direction="row" w="full" gap="2" alignItems="center" justifyContent="space-between">
            <Text color="white"> Price </Text>
            <Flex direction="row" gap="2">
                {["$", "$$", "$$$", "$$$$"].map(price => (
                    <Button
                        key={price}
                        size="sm"
                        borderRadius="10px"
                        bg={selectedPrice === price ? "purple.400" : "white"}
                        color={selectedPrice === price ? "white" : "black"}
                        onClick={() => handleSelect(price)}
                    >
                        {price}
                    </Button>
                ))}
            </Flex>
        </Flex>
    );
};

export default Prices;
