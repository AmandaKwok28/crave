import { Flex, Input, Tag } from "@chakra-ui/react"
import { Field } from "@/components/ui/field";
import { useState } from "react";

const TagInput = ({
    title,
    placeholder,
    tags,
    setTags
}:{
    title:string,
    placeholder:string,
    tags: string[],
    setTags: any
}) => {

    const [inputValue, setInputValue] = useState<string>("");
    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: any) => {
        const value = inputValue.trim();
        if (e.key === "Enter" && value !== "") {
            setTags([...tags, value]);
            setInputValue("");
        }
    }

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    }

    return (
        <Flex direction="column" >
            <Field label={title} required>
            <Input
                placeholder={`e.g. ${placeholder}`}
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
                    <Tag.EndElement>
                        <Tag.CloseTrigger onClick={() => removeTag(tag)}/>
                    </Tag.EndElement>
                </Tag.Root>
                ))}
            </Flex>
        </Flex>
    )
}

export default TagInput;