import { Avatar } from "@/components/ui/avatar";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "@/components/ui/select";
import { toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/use-auth";
import { $router } from "@/lib/router";
import { Card, Image, Flex, Input, VStack, createListCollection, Button, HStack } from "@chakra-ui/react";
import { redirectPage } from "@nanostores/router";
import { useRef, useState } from "react";

export default function Register() {
  const { register } = useAuth();

  const name_ref = useRef<HTMLInputElement>(null);
  const email_ref = useRef<HTMLInputElement>(null);
  const password_ref = useRef<HTMLInputElement>(null);

  // Select elements don't support refs the same way
  const [ school, setSchool ] = useState<string>();
  const [ major, setMajor ] = useState<string>();

  const [ loading, setLoading ] = useState<boolean>(false);

  async function sendRegister() {    
    const name = name_ref.current?.value;
    const email = email_ref.current?.value;
    const password = password_ref.current?.value;

    if (!name || !email || !password || !school || !major) {
      toaster.create({
        title: 'Please fill out all required fields'
      });

      return;
    }

    setLoading(true);

    register(email, password, name, school, major)
      .then(() => redirectPage($router, 'home'))
      .catch(() => toaster.create({
        title: 'Error during registration',
        description: 'Please try again later'
      }))
      .finally(() => setLoading(false));
  }

  // 1,000,000% These variables get moved to a db/standardized dictionary somewhere
  const schools = createListCollection({
    items: [
      { label: 'Johns Hopkins University', value: 'jhu' }
    ]
  });

  const majors = createListCollection({
    items: [
      { label: 'Neuroscience', value: 'neuro' },
      { label: 'Computer Science', value: 'compsci' }
    ]
  });

  return (
    <Flex
      w='100vw' 
      minH='xl' 
      h='100vh' 
      alignItems='center' 
      justify='flex-end' 
      background='linear-gradient(155deg, rgba(0,193,186,1) 0%, rgba(6,74,144,1) 55%, rgba(237,0,255,1) 100%)'
    >
      <Image
        src='register.jpg'
        pos='absolute'
        objectFit='cover'
        top='0'
        left='0'
        h='100%'
        w={{ base: '100%', lg: '50%' }}
        filter={{ base: 'blur(4px)', lg: 'none' }}
      />

      <VStack w={{ base: '100%', lg: '50%' }} alignItems='center' justify='center'>
        <Card.Root size='md' w={{ base: 'sm', md: 'md' }} variant='subtle'>
          <Card.Body gap='3'>
            <HStack justify='space-between' align='start' gap='2'>
              <VStack align='start'>
                <Card.Title fontWeight='bold'>Register</Card.Title>
                <Card.Description>Create a new Crave account</Card.Description>
              </VStack>
              <Avatar size='xl' shape='rounded' src='croissant.svg' />
            </HStack>

            <Field label='Name' required>
              <Input ref={name_ref} placeholder='John Doe' variant='outline' />
            </Field>

            <Field label='Email' required>
              <Input ref={email_ref} placeholder='me@school.edu' variant='outline' />
            </Field>

            <Field label='Password' required>
              <PasswordInput ref={password_ref} variant='outline' />
            </Field>

            <HStack>
              <Field label='School' required>
                <SelectRoot
                  collection={schools}
                  onValueChange={(e) => setSchool(e.value[0])}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder='Pick your school' />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.items.map((school) => (
                      <SelectItem key={school.value} item={school}>
                        {school.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </Field>

              <Field label='Major' required>
                <SelectRoot
                  collection={majors}
                  onValueChange={(e) => setMajor(e.value[0])}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder='Pick your major' />
                  </SelectTrigger>
                  <SelectContent>
                    {majors.items.map((major) => (
                      <SelectItem key={major.value} item={major}>
                        {major.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </Field>
            </HStack>
          </Card.Body>

          <Card.Footer justifyContent='center'>
            <Button w='40%' onClick={sendRegister} loading={loading}>
              Register!
            </Button>
          </Card.Footer>
        </Card.Root>
      </VStack>
    </Flex>
  );
}
