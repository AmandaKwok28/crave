import { Box, Tag } from "@chakra-ui/react";
import { useStore } from "@nanostores/react";
import { $filters, setFilters } from "@/lib/store";

const SearchSummary = () => {
    const filters = useStore($filters);

    // const handleRemove = (filterKey: string) => {
    //     const updatedFilters = { ...filters };
    //     // updatedFilters[filterKey] = null;
    //     setFilters(updatedFilters);
    // };

    return (
        <Box
            h="3vh"
            w="75vw"
            mt="2"
            overflowX="auto"
            alignContent="center"
            spaceX="2"
            overflowY="hidden"
        >
            {Object.values(filters).map((value, index) => {
                if (value && (Array.isArray(value) ? value.length > 0 : true)) {  // Only show non-null or non-empty filters
                    return (
                        <Tag.Root
                            key={index}
                            variant="subtle"
                            size="lg"
                            w="fit-content"
                            bgGradient='to-r' gradientFrom="purple.500" gradientTo="cyan.300"
                            color="white"
                            borderRadius="10px"
                        >
                            <Tag.Label>{`${value}`}</Tag.Label>
                            {/* <Tag.EndElement>
                                <Tag.CloseTrigger onClick={() => handleRemove(value)} />
                            </Tag.EndElement> */}
                        </Tag.Root>
                    );
                }
                return null;
            })}
        </Box>

    );
};

export default SearchSummary;