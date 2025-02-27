import { Box, Input, Stack } from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import { Button } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"
import { getPagePath, redirectPage } from "@nanostores/router"
import { $router } from "@/lib/router"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { toaster } from "@/components/ui/toaster"
import FieldErrorText from "@/components/fielderrortext"

const Login = () => {

    const { signIn } = useAuth();
    const [email, setEmail] = useState<string>("");
    const [pass, setPass] = useState<string>("");

    const [ loading, setLoading ] = useState<boolean>(false);
    const [ errors, setErrors ] = useState<LoginErrorType>({});

    type LoginErrorType = {
        email?: string[];
        password?: string[];
      };
  
    const handleSubmit = async (email: string, password: string) => {
        if (!email || !password) {
            toaster.create({
                title: 'Please fill in all fields'
            });

            return;
        }

        setLoading(true);

        signIn(email, password)
            .then(() => redirectPage($router, 'home'))
            .catch((error) => {
                // Ew, a try/catch inside a catch block (TODO: fix...)
                try {
                    setErrors(JSON.parse(error.message));
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (_err) {
                    setErrors({})
                    toaster.create({
                        title: 'Error signing in',
                        description: error.message
                    })
                }
            })
            .finally(() => setLoading(false));
        }

    const handleSetEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handleSetPass = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPass(e.target.value);
    }

    // TODO: add state to record input for username and password
    
    return (
        <Box className="bg-white w-screen h-screen flex justify-center" bgGradient="to-r" gradientFrom="cyan.100" gradientTo="blue.400">
            <Box className="flex items-center justify-center h-full flex-col max-w-sm" style={{color: "black"}}>
                <Box className="bg-white p-5" borderRadius="lg" py="20">
                <h2 className="text-3xl font-bold tracking-tight text-center text-foreground">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-sm text-center text-muted-foreground">
                    Or{" "}
                <a
                    href={getPagePath($router, "register")}
                    className="font-medium text-primary hover:text-primary/80 hover:underline"
                >
                    create a new account
                </a>
                </p>

                <Stack className="w-[350px] gap-2">
                
                    <Field label="Email" required className="py-1" invalid={!!errors.email} errorText={<FieldErrorText errors={errors.email} />}>
                        <Input placeholder="Enter your email" variant='outline' onChange={(e) => handleSetEmail(e)}/>
                    </Field>
                    <Field label="Password" required className="py-1" invalid={!!errors.password} errorText={<FieldErrorText errors={errors.password} />}>
                        <PasswordInput placeholder="Enter your password" variant='outline' onChange={(e) => handleSetPass(e)}/>
                    </Field>

                    <Button className="bg-black text-white" type="submit" loading={loading} onClick={() => handleSubmit(email, pass)}>
                        Sign-In
                    </Button>

                </Stack>
                </Box>

                
            </Box>
            
        </Box>
    )
}

export default Login;