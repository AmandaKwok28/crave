import { Flex, Input, Tag } from "@chakra-ui/react"
import { useState } from "react"
import { Field } from "../ui/field";


const AutoAllergens = ({
    tags,
    editableTags,
    setEditable
}: {
    tags: string[],
    editableTags: string[],
    setEditable: any
}) => {

    const [inputValue, setInputValue] = useState<string>("");
    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: any) => {
        const value = inputValue.trim();
        if (e.key === "Enter" && value !== "") {
            setEditable([...editableTags, value]);
            setInputValue("");
        }
    }

    const removeTag = (tagToRemove: string) => {
        setEditable(editableTags.filter(tag => tag !== tagToRemove));
    }
    

    return (
        <Flex direction="column" >
            <Field label='Allergens' required>
            <Input
                placeholder='e.g. peanuts'
                color="black"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}>
            </Input>
            </Field>

            <Flex wrap="wrap" gap="2" mt="2">
                {tags.map((tag, index) => (
                <Tag.Root key={index} variant="outline" size="lg" w="fit-content">
                    <Tag.Label>{tag}</Tag.Label>
                </Tag.Root>
                ))}
                {editableTags.map((tag, index) => (
                <Tag.Root key={index} variant="outline" size="lg" w="fit-content">
                    <Tag.Label>{tag}</Tag.Label>
                    <Tag.EndElement>
                        <Tag.CloseTrigger onClick={() => removeTag(tag)}/>
                    </Tag.EndElement>
                </Tag.Root>
                ))}
            </Flex>
        </Flex>
    )
}

export default AutoAllergens;