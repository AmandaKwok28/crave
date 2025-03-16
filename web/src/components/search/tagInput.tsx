import { $deletedSearchTag, $filters, addSearchTags, removeSearchTags, setFilters } from "@/lib/store";
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
    const filters = useStore($filters);

    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
    };

    // adding tags: 
    const handleKeyDown = (e: any) => {
        const value = inputValue.trim().toLowerCase();   // make sure that the tag inputs only send lowercase values
        if (e.key === "Enter" && value !== "") {
            setTags([...tags, value]);
            addSearchTags(value)
            setInputValue("");

            let change;
            if (title === "Grocery Stores") { // sources
                change = {
                    "sources": [...filters.sources, value]
                }
            } else if (title === "Ingredients") {
                change = {
                    "ingredients": [...filters.ingredients, value]
                }
            } else if (title === "Allergies") {
                change = {
                    "allergens": [...filters.allergens, value]
                }
            } else if (title === "Major") {
                change = {
                    "major": value
                }
            } else if (title === "Meal Type") {
                change = {
                    "mealTypes": [...filters.mealTypes, value]
                }
            }

            setFilters(change);
            
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
        removeSearchTags(tagToRemove)

        let change;
        if (title === "Grocery Stores") { // sources
            change = {
                "sources": [...filters.sources.filter((item) => {return item !== tagToRemove})]
            }
        } else if (title === "Ingredients") {
            change = {
                "ingredients": [...filters.ingredients.filter((item) => {return item !== tagToRemove})]
            }
        } else if (title === "Allergies") {
            change = {
                "ingredients": [...filters.allergens.filter((item) => {return item !== tagToRemove})]
            }
        } else if (title === "Major") {
            change = {
                "major": null
            }
        } else if (title === "Meal Type") {
            change = {
                "mealTypes": [...filters.mealTypes.filter((item) => {return item !== tagToRemove})]
            }
        }

        setFilters(change);
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