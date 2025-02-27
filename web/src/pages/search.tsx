import NavBar from "@/components/layout/navBar";
import { Box, Flex, Text} from "@chakra-ui/react";

const Search = () => {
    return (
    <Flex direction="column" h="100vh">
        <NavBar/>
        <Flex flex="1">
            <Box w="400px" bg="gray.200" p="4">
            Sidebar
            </Box>
            <Box flex="1" bg="white" p="4">
            </Box>
        </Flex>
    </Flex>

    )
}

export default Search;