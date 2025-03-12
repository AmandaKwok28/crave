import { $filters, setFilters } from "@/lib/store";
import { 
    Flex, 
    Text, 
    RadioGroup,
    VStack,
    Button,
    HStack,
    Spacer
} from "@chakra-ui/react";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";

const DifficultyButtons = ({
    title,
    options,
    color,
    home
}:{
    title:string,
    options:string[],
    color: string
    home?: boolean
}) => {
    
    const filters = useStore($filters);
    const [value, setValue] = useState(filters.difficulty || "1")

    useEffect(() => {
        setValue(filters.difficulty || "1");
    }, [filters.difficulty]);

    const handleClick = (option:string) => {
        setValue(option);
        const change = {
            [title.toLowerCase()]: option
        }

        setFilters(change);
    }

    const handleClear = () => {
        setValue("1");
        setFilters({"difficulty": null})
    }

    return(
        <Flex flexDirection={`${home ? "row" : 'column'}`} gap={2}> 
        <Text
            fontSize="sm"
            mb="5px"
            color={color}
            fontWeight="bold"
        >
            {title}
        </Text>

        {home && (
            <Spacer />
        )}

        <RadioGroup.Root value={value} onValueChange={(e) => handleClick(e.value)} flexWrap="nowrap">
        {!home && <VStack align="start">
            {options.map((item) => (
            <RadioGroup.Item key={item} value={item}>
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText color={color}>{item}</RadioGroup.ItemText>
            </RadioGroup.Item>
            ))}
        </VStack>}

        {home && <HStack align="start">
            {options.map((item) => (
            <RadioGroup.Item key={item} value={item}>
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText color={color}>{item}</RadioGroup.ItemText>
            </RadioGroup.Item>
            ))}
        </HStack>}

        </RadioGroup.Root>

        {!home && (<Button variant="outline" size="sm" borderRadius="12px" color={color} onClick={() => handleClear()}>
            Clear
        </Button>)}

        </Flex>
    )
}

export default DifficultyButtons;