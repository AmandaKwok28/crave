import { $filters, setFilters } from "@/lib/store";
import { 
    Flex, 
    Text, 
    Stack,
    Checkbox
} from "@chakra-ui/react";
import { useStore } from "@nanostores/react";

const CuisineCheckBoxes = ({
    title,
    options,
    color
}:{
    title:string,
    options:string[],
    color: string
}) => {

    const filters = useStore($filters);
    const capitalizeFirstLetter = (str: string): string => 
        str[0].toUpperCase() + str.slice(1).toLowerCase();

    const handleClick = (option: string, checked: string | boolean) => {

        let change;
        if (checked) {
            // if it's true, add it to the list
            change = {
                [title.toLowerCase()]: [...filters.cuisine, option]
            }
        } else {
            change = {
                [title.toLowerCase()]: filters.cuisine.filter((item: string) => { return item !== option})
            }
        }
        
        setFilters(change);
        // console.log(filters)
    }


    return(
        <Flex flexDirection="column" gap={2}> 
        <Text
            fontSize="sm"
            mb="5px"
            color={color}
            fontWeight="bold"
        >
            {capitalizeFirstLetter(title)}
        </Text>

        {options.map((option, index) => (
            <Stack key={index} align="flex-start">
                <Checkbox.Root 
                    onCheckedChange={(checked) => handleClick(option, checked.checked)}
                >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                        <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Label color={color}>{capitalizeFirstLetter(option)}</Checkbox.Label>
                </Checkbox.Root>
            </Stack>
        ))}


        </Flex>
    )
}

export default CuisineCheckBoxes;