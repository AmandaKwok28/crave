import { $deletedSearchTag, addSearchTags, removeSearchTags } from "@/lib/store";
import { Flex, Input, Text } from "@chakra-ui/react"
import { Tag } from "@chakra-ui/react";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";

const TagInput = ({
    title,
    placeholder
}:{
    title:string,
    placeholder:string
}) => {

    // set the state for tag input values and tags created
    const [inputValue, setInputValue] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const deletedSearchTag = useStore($deletedSearchTag);

    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: any) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            setTags([...tags, inputValue.trim()]);
            addSearchTags(inputValue.trim())
            setInputValue("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
        removeSearchTags(tagToRemove)
    };

    // delete the tag from the sidebar if a new deleted tag is set
    useEffect(() => {
        removeTag(deletedSearchTag);
    }, [deletedSearchTag])


    return (
        <Flex direction="column" >
            <Text
                fontSize="sm"
                mb="5px"
                color="white"
            >
                {title}
            </Text>
            <Input
                placeholder={`e.g. ${placeholder}`}
                variant="subtle"
                color="black"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}>
            </Input>

            <Flex wrap="wrap" gap="2" mt="2">
                {tags.map((tag, index) => (
                <Tag.Root key={index} variant="subtle" size="lg" w="fit-content">
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