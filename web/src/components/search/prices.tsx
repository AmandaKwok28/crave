import { useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { setFilters } from "@/lib/store";

const Prices = () => {
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

    const handleSelect = (price: string) => {
        setSelectedPrice(prev => {
            const newPrice = prev === price ? null : price; // Toggle selection
    
            let change;
            if (newPrice === "$") {
                change = { price: "CHEAP" };
            } else if (newPrice === "$$") {
                change = { price: "MODERATE" };
            } else if (newPrice === "$$$") {
                change = { price: "PRICEY" };
            } else if (newPrice === "$$$$") {
                change = { price: "EXPENSIVE" };
            } else {
                change = { price: null };
            }
    
            setFilters(change);
            return newPrice; // Update state after setting filters
        });
    };
    


    return (
        <Flex direction="row" w="full" gap="2" alignItems="center" justifyContent="space-between">
            <Text color="white"> Price </Text>
            <Flex direction="row" gap="2">
                {["$", "$$", "$$$", "$$$$"].map((price) => (
                    <Button
                        key={price}
                        size="sm"
                        borderRadius="10px"
                        bg={selectedPrice === price ? "purple.400" : "white"}
                        color={selectedPrice === price ? 'white' : 'black'}
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
