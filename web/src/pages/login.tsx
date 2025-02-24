import { Box, Input, Stack } from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import { Button } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"

const Login = () => {
    return (
        <Box className="bg-white w-screen h-screen" bgGradient="to-r" gradientFrom="cyan.100" gradientTo="blue.400">
            <Box className="flex items-center justify-center h-full flex-col" style={{color: "black"}}>
                <Box className="bg-white p-5" borderRadius="lg" py="20">
                <h2 className="text-3xl font-bold tracking-tight text-center text-foreground">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-sm text-center text-muted-foreground">
                    Or{" "}
                <a
                    // href={getPagePath($router, "register")}
                    className="font-medium text-primary hover:text-primary/80 hover:underline"
                >
                    create a new account
                </a>
                </p>

                <Stack className="w-[350px] gap-2">
                
                    <Field label="Username" required className="py-1">
                        <Input placeholder="Enter your username" className="border-[1px] p-1" style={{borderColor: "black"}}/>
                    </Field>
                    <Field label="Password" required className="py-1">
                        <PasswordInput placeholder="Enter your password" className="border-[1px] p-1" style={{borderColor: "black"}}/>
                    </Field>

                    <Button className="bg-black text-white">
                        Sign-In
                    </Button>

                </Stack>
                </Box>

                
            </Box>
            
        </Box>
    )
}

export default Login;