import { Box, Tag } from "@chakra-ui/react";
import { useStore } from "@nanostores/react";
import { $filters } from "@/lib/store";

const SearchSummary = () => {
    const filters = useStore($filters);
    const capitalizeFirstLetter = (str: string): string => 
        str[0].toUpperCase() + str.slice(1).toLowerCase();

    return (
        <Box
            h="3vh"
            w="75vw"
            mt="2"
            overflowX="auto"
            alignContent="center"
        >   
            Your Search:&nbsp;&nbsp;

            {/* Tags */}
            {Object.values(filters).map((value, index) => {
                if (value && (Array.isArray(value) ? value.length > 0 : true)) {
                    if (Array.isArray(value)) {
                        return value.map((item, itemIndex) => (
                            <Tag.Root
                                key={`${index}-${itemIndex}`}
                                variant="subtle"
                                size="lg"
                                w="fit-content"
                                bgGradient='to-r' gradientFrom="purple.500" gradientTo="cyan.300"
                                color="white"
                                borderRadius="10px"
                                mr="2"
                            >
                                <Tag.Label>{typeof item === 'string' ? capitalizeFirstLetter(item) : item}</Tag.Label>
                            </Tag.Root>
                        ));
                    }

                    return (
                        <Tag.Root
                            key={index}
                            variant="subtle"
                            size="lg"
                            w="fit-content"
                            bgGradient='to-r' gradientFrom="purple.500" gradientTo="cyan.300"
                            color="white"
                            borderRadius="10px"
                            mr="2"
                        >
                            <Tag.Label>{typeof value === 'string' ? capitalizeFirstLetter(value) : value}</Tag.Label>
                        </Tag.Root>
                    );
                }
                return null;
            })}
        </Box>

    );
};

export default SearchSummary;