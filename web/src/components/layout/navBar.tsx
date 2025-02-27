import { useAuth } from "@/hooks/use-auth";
import { $router } from "@/lib/router";
import { Button, Flex, Spacer, Text } from "@chakra-ui/react";
import { openPage, redirectPage } from "@nanostores/router";
import { Ellipsis, Plus, Search } from "lucide-react";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu";
import { toaster } from "../ui/toaster";

const NavBar = () => {

    const { logout } = useAuth();
    const handleLogout = async () => {
        logout()
            .then(() => redirectPage($router, 'login'))
            .catch(() => {
                toaster.create({
                    title: 'Error signing out',
                    description: 'Please try again later'
                })
            });
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
            <Text fontSize='3xl' fontWeight='bold' color='white'>Crave</Text>
            <Spacer />
            <Button variant="outline" bg="white" size="xs">
                <Plus color='black' />
            </Button>
            <Button variant="outline" bg="white" size="xs">
                <Search color='black' />
            </Button>

            <MenuRoot>
                <MenuTrigger asChild>
                    <Button variant='outline' bg='white' size='xs'>
                        <Ellipsis color='black' />
                    </Button>
                </MenuTrigger>
                <MenuContent>
                    <MenuItem value='profile' onClick={() => openPage($router, 'profile')}>
                        Profile
                    </MenuItem>
                    <MenuItem value='logout' color='red.400' onClick={handleLogout}>
                        Logout
                    </MenuItem>
                </MenuContent>
            </MenuRoot>
        </Flex>
    )
}

export default NavBar;