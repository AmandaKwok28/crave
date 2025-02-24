import { Box, Button, Spacer } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react"

const Profile = () => {
    return (
        <div className="bg-white w-screen h-screen text-black">
            <Box 
                bgGradient="to-r" gradientFrom="cyan.400" gradientTo="cyan.700"
                h="50px" 
                display="flex"
                alignItems="center"
                className="p-4 text-white"
                fontWeight="bold"
                fontSize="2xl"
            >
                <h1> Crave </h1>
                <Spacer/>
                <Button 
                    className="text-sm bg-black p-4" 
                    style={{fontWeight: "normal"}} 
                    variant="outline"
                    bg="white"
                    color="black"
                    size="xs"
                >
                    Sign out
                </Button>
            </Box>

            <div className="flex flex-row h-full">
                <Box 
                    className="h-full w-1/4 flex flex-row max-h-sm items-start items-start"
                    bgGradient="to-r" gradientFrom="purple.600" gradientTo="cyan.200"
                >
                    <div className="items-center flex flex-row">
                        <Box className="p-4 items-center">
                            <Image borderRadius="full" src="anon.jpg" boxSize="50px"/>
                        </Box>
                        <div>
                            <h2 className="text-white text-xl font-bold">
                                Anonymous User
                            </h2>
                            <h1 className="text-white">
                                @username
                            </h1>
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