import { setFilters } from "@/lib/store";
import { 
    Flex, 
    Text, 
    RadioGroup,
    VStack,
    Button
} from "@chakra-ui/react";
import { useState } from "react";

const DifficultyButtons = ({
    title,
    options,
    color
}:{
    title:string,
    options:string[],
    color: string
}) => {

    const [value, setValue] = useState("1")

    const handleClick = (option:string) => {
        setValue(option);
        const change = {
            [title]: option
        }

        setFilters(change);
    }

    const handleClear = () => {
        setValue("1");
        setFilters({"difficulty": null})
    }

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

        <RadioGroup.Root value={value} onValueChange={(e) => handleClick(e.value)} flexWrap="nowrap">
        <VStack align="start">
            {options.map((item) => (
            <RadioGroup.Item key={item} value={item}>
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText color={color}>{item}</RadioGroup.ItemText>
            </RadioGroup.Item>
            ))}
        </VStack>
        </RadioGroup.Root>

        <Button variant="outline" size="sm" borderRadius="12px" color={color} onClick={() => handleClear()}>
            Clear
        </Button>

        </Flex>
    )
}

export default DifficultyButtons;