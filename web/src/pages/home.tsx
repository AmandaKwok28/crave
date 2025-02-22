import NavBar from "@/components/layout/navBar";
import { Box, Flex } from "@chakra-ui/react";

const Home = () => {
    return (
        <Flex style={{backgroundColor: "white"}} className="flex flex-col">
            <NavBar/>
            <Box className="w-screen h-screen">
                center
            </Box>
        </Flex>
    )
}

export default Home;