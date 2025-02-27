import { Button, Flex, MenuContent, MenuItem, MenuRoot, MenuTrigger, Spacer } from "@chakra-ui/react";
import { $router } from "@/lib/router";
const NavBar = () => {
    return (
        <Flex 
            h="5vh" 
            color="black"
            className="flex items-center w-screen"
            backgroundColor="cyan.600"
            p="4"
            gap="2"
        >
            <Button color="white" textStyle="3xl" fontWeight="bold" mb="3px">
                Crave
            </Button>
            <Spacer />
            <Button variant="outline" bg="white" size="xs">
                +
            </Button>
            <Button variant="outline" bg="white" size="xs" onClick={() => $router.open("search")}>
                browse
            </Button>
            
            <MenuRoot>
                <MenuTrigger asChild>
                    <Button variant="outline" bg="white" size="xs">
                        ...
                    </Button>
                </MenuTrigger>
                <MenuContent >
                    <MenuItem value="profile">
                        profile
                    </MenuItem>
                    <MenuItem value="logout">
                        logout
                    </MenuItem>
                </MenuContent>
            </MenuRoot>
        </Flex>
    )
}

export default NavBar;