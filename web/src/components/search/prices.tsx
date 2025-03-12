import { useEffect, useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { $filters, setFilters } from "@/lib/store";
import { useStore } from "@nanostores/react";

const Prices = () => {
    const filters = useStore($filters);
    
    const priceMap: Record<string, string> = {
        "CHEAP": "$",
        "MODERATE": "$$",
        "PRICEY": "$$$",
        "EXPENSIVE": "$$$$"
    };

    const [selectedPrice, setSelectedPrice] = useState<string | null>(
        filters.price ? priceMap[filters.price] || null : null
    );

    useEffect(() => {
        setSelectedPrice(filters.price ? priceMap[filters.price] || null : null);
    }, [filters.price]);

    const handleSelect = (price: string) => {
        const newPrice = selectedPrice === price ? null : price;
        setSelectedPrice(newPrice);

        const reversePriceMap: Record<string, string | null> = {
            "$": "CHEAP",
            "$$": "MODERATE",
            "$$$": "PRICEY",
            "$$$$": "EXPENSIVE"
        };

        setFilters({ price: reversePriceMap[newPrice ?? ""] ?? null });
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