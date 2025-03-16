import FieldErrorText from "@/components/fielderrortext";
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

function RegisterForm() {
  const { register } = useAuth();

  const name_ref = useRef<HTMLInputElement>(null);
  const email_ref = useRef<HTMLInputElement>(null);
  const password_ref = useRef<HTMLInputElement>(null);

  // Select elements don't support refs the same way
  const [ school, setSchool ] = useState<string>();
  const [ major, setMajor ] = useState<string>();

  const [ loading, setLoading ] = useState<boolean>(false);
  const [ errors, setErrors ] = useState<RegisterErrorType>({});

  type RegisterErrorType = {
    name?: string[];
    email?: string[];
    password?: string[];
    school?: string[];
    major?: string[];
  };

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

    // made major lowercase for searching
    register(email, password, name, school, major.toLowerCase())
      .then(() => redirectPage($router, 'home'))
      .catch((error) => setErrors(JSON.parse(error.message)))
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
    <Card.Root size='md' w={{ base: 'sm', md: 'md' }} variant='subtle'>
      <Card.Body gap='3'>
        <HStack justify='space-between' align='start' gap='2'>
          <VStack align='start'>
            <Card.Title fontWeight='bold'>Register</Card.Title>
            <Card.Description>Create a new Crave account</Card.Description>
          </VStack>
          <Avatar size='xl' shape='rounded' src='croissant.svg' />
        </HStack>

        <Field
          label='Name'
          required
          invalid={!!errors.name}
          errorText={<FieldErrorText errors={errors.name} />}
        >
          <Input ref={name_ref} placeholder='John Doe' variant='outline' />
        </Field>

        <Field
          label='Email'
          required
          invalid={!!errors.email}
          errorText={<FieldErrorText errors={errors.email} />}
        >
          <Input ref={email_ref} placeholder='me@school.edu' variant='outline' />
        </Field>
        
        <Field
          label='Password'
          required
          invalid={!!errors.password}
          errorText={<FieldErrorText errors={errors.password} />}
        >
          <PasswordInput ref={password_ref} variant='outline' />
        </Field>

        <HStack>
          <Field 
            label='School'
            required
            invalid={!!errors.school}
            errorText={<FieldErrorText errors={errors.school} />}
          >
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

          <Field
            label='Major'
            required 
            invalid={!!errors.major}
            errorText={<FieldErrorText errors={errors.major} />}
          >
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
  );
}

export default function Register() {
  return (
    <Flex
      w='100vw' 
      minH='xl' 
      h='100vh' 
      alignItems='center' 
      justify='flex-end' 
      bgGradient='to-r'
      gradientFrom='cyan.100'
      gradientTo='blue.400'
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
        <RegisterForm />
      </VStack>
    </Flex>
  );
}
