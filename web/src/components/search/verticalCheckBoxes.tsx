import { 
    Flex, 
    Text, 
    Stack, 
    Checkbox 
} from "@chakra-ui/react";

const VerticalCheckBoxes = ({
    title,
    options
}:{
    title:string,
    options:string[]
}) => {
    return(
        <Flex flexDirection="column" gap={2}> 
        <Text
            fontSize="sm"
            mb="5px"
            color="white"
            fontWeight="bold"
        >
            {title}
        </Text>
            {options.map((option, index) => (
                <Stack key={index} align="flex-start">
                <Checkbox.Root>
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                    <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Label color="white">{option}</Checkbox.Label>
                </Checkbox.Root>
                </Stack>
            ))}
        </Flex>
    )
}

export default VerticalCheckBoxes;