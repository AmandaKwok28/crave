import NavBar from "@/components/layout/navBar";
import { useAuth } from "@/hooks/use-auth";
import { $router } from "@/lib/router";
import { Box, Button, Spacer } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react"
import { openPage, redirectPage } from "@nanostores/router";

const Profile = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        redirectPage($router, "login");
    }
    
    return (
        <div className="bg-white w-screen h-screen text-black overflow-hidden">
            <NavBar/>

            <div className="flex flex-row h-full">

                
                <Box 
                    className="h-full w-1/4 flex flex-row"
                    bgGradient="to-l" gradientFrom="green.200" gradientTo="blue.300"
                >
                    <div className="max-h-sm h-auto flex flex-col self-start w-full">
                        <div className="flex items-center flex-row">
                            <Box className="p-4 items-center">
                                <Image borderRadius="full" src="anon.jpg" boxSize="50px"/>
                            </Box>
                            <div>
                                <h2 className="text-white text-xl font-bold">
                                    {user.name}
                                </h2>
                                <h1 className="text-white">
                                    {user.email}
                                </h1>
                            </div>
                        </div>

                        <div className="max-h-sm h-auto p-4 text-white w-full space-y-2">
                            <Button 
                                className="w-full" 
                                bgGradient="to-l" gradientFrom="teal.300" gradientTo="blue.400"
                            >
                                My Recipes
                            </Button>

                            <Button 
                                className="w-full" 
                                bgGradient="to-l" gradientFrom="teal.300" gradientTo="blue.400"
                            >
                                My Drafts
                            </Button>
                        </div>
                    </div>

                </Box>
                

                <div className="flex items-center justify-center w-full">
                    Feed
                </div>
            </div>

        </div>
    )
}

export default Profile;