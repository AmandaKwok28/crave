import { useAuth } from "@/hooks/use-auth";
import { $router } from "@/lib/router";
import { ButtonGroup, Flex, IconButton, Text } from "@chakra-ui/react";
import { openPage, redirectPage } from "@nanostores/router";
import { LogOut, PlusCircleIcon, Search, User } from "lucide-react";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu";
import { toaster } from "../ui/toaster";
import { clearFilters } from "@/lib/store";
import CreateNewPartyButton from "../party/createNewPartyButton";

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

    const handleHome = () => {
        clearFilters();
        openPage($router, "home");
    }

    return (
        <Flex
            pos='fixed'
            top='0'
            left='0'
            h='10'
            w='100vw'
            bgGradient="to-r"
            gradientFrom="cyan.300"
            gradientTo="blue.400"
            justify='space-between'
            align='center'
            px='4'
            gap='2'
            zIndex={999}
        >
            <Text
                fontSize='3xl'
                fontWeight='bold'
                color='bg'
                onClick={handleHome}
                _hover={{ cursor: 'pointer' }}
            >
                Crave
            </Text>

            <ButtonGroup gap='3' variant='subtle' size='xs'>
                <CreateNewPartyButton />
                <IconButton onClick={() => openPage($router, 'createRecipe')}>
                    <PlusCircleIcon />
                </IconButton>
                
                <IconButton onClick={() => openPage($router, 'search')}>
                    <Search />
                </IconButton>
                <MenuRoot>
                    <MenuTrigger asChild>
                        <IconButton>
                            <User />
                        </IconButton>
                    </MenuTrigger>
                    <MenuContent>
                        <MenuItem value='profile' onClick={() => openPage($router, 'profile')}>
                            View Profile
                        </MenuItem>
                        <MenuItem value='logout' color='red.400' onClick={handleLogout} justifyContent='space-between'>
                            Logout
                            <LogOut size='14px' />
                        </MenuItem>
                    </MenuContent>
                </MenuRoot>
            </ButtonGroup>
        </Flex>
    );
}

export default NavBar;