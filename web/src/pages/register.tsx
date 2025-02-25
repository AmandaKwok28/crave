import { Avatar } from "@/components/ui/avatar";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "@/components/ui/select";
import { Card, Image, Flex, Input, VStack, createListCollection, Button, HStack } from "@chakra-ui/react";

export default function Register() {
  const schools = createListCollection({
    items: [
      { label: 'Johns Hopkins University', value: 'jhu' }
    ]
  });

  // 1,000,000% This gets moved to a db/standardized dictionary somewhere
  const majors = createListCollection({
    items: [
      { label: 'Neuroscience', value: 'neuro' },
      { label: 'Computer Science', value: 'compsci' }
    ]
  });

  return (
    <Flex w='100vw' minH='xl' h='100vh' alignItems='center' justify='flex-end'>
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
        <Card.Root size='md' w={{ base: 'sm', md: 'md' }}>
          <Card.Body gap='3'>
            <HStack justify='space-between' align='start' gap='2'>
              <VStack align='start'>
                <Card.Title fontWeight='bold'>Register</Card.Title>
                <Card.Description>Create a new Crave account</Card.Description>
              </VStack>
              <Avatar size='xl' shape='rounded' src='croissant.svg' />
            </HStack>

            <Field label='Name' required>
              <Input placeholder='John Doe' variant='outline' />
            </Field>

            <Field label='Email' required>
              <Input placeholder='me@school.edu' variant='outline' />
            </Field>

            <Field label='Password' required>
              <PasswordInput variant='outline' />
            </Field>

            <HStack>
              <Field label='School' required>
                <SelectRoot collection={schools}>
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
                <SelectRoot collection={majors}>
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
            <Button w='40%'>
              Register!
            </Button>
          </Card.Footer>
        </Card.Root>
      </VStack>
    </Flex>
  );
}
