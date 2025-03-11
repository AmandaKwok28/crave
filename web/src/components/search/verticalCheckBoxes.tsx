import { 
    Flex, 
    Text, 
    Stack, 
    Checkbox 
} from "@chakra-ui/react";

const VerticalCheckBoxes = ({
    title,
    options,
    color
}:{
    title:string,
    options:string[],
    color: string
}) => {
    return(
        <Flex flexDirection="column" gap={2}> 
        <Text
            fontSize="sm"
            mb="5px"
            color={color}
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
                    <Checkbox.Label color={color}>{option}</Checkbox.Label>
                </Checkbox.Root>
                </Stack>
            ))}
        </Flex>
    )
}

export default VerticalCheckBoxes;