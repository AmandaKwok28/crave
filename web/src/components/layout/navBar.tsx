import { useAuth } from "@/hooks/use-auth";
import { $router } from "@/lib/router";
import { Box, Button, Flex, MenuContent, MenuItem, MenuRoot, MenuTrigger, Spacer } from "@chakra-ui/react";
import { openPage, redirectPage } from "@nanostores/router";
import { Ellipsis, Plus, Search } from "lucide-react";

const NavBar = () => {

    const { logout } = useAuth();
    const handleLogout = async () => {
        await logout();
        redirectPage($router, "login");
    }

    return (
        <Flex 
            h="5vh" 
            color="black"
            className="flex items-center w-screen"
            bgGradient="to-r" gradientFrom="cyan.300" gradientTo="blue.400"
            p="4"
            gap="2"
        >
            <Button color="white" textStyle="3xl" fontWeight="bold" mb="3px">
                Crave
            </Button>
            <Spacer />
            <Button variant="outline" bg="white" size="xs">
                <Plus />
            </Button>
            <Button variant="outline" bg="white" size="xs">
                <Search />
            </Button>
            
            <Box> 
                <MenuRoot>
                    <MenuTrigger asChild>
                        <Button variant="outline" bg="white" size="xs">
                            <Ellipsis />
                        </Button>
                    </MenuTrigger>
                    <MenuContent position="absolute" right={4} mt={3} zIndex="dropdown">
                        <MenuItem value="profile" onClick={() => openPage($router, "profile")}>
                            profile
                        </MenuItem>
                        <MenuItem value="logout" onClick={handleLogout}>
                            logout
                        </MenuItem>
                    </MenuContent>
                </MenuRoot>
            </Box>
        </Flex>
    )
}

export default NavBar;