import { Text } from "@chakra-ui/react";

export default function FieldErrorText({ errors }: { errors?: string[] }) {
  if (!errors) {
    return null;
  }

  return (
    <Text whiteSpace='pre-line'>
      {errors.join('\n')}
    </Text>
  );
}
