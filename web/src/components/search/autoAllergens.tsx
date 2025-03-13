import { Button, Flex, Input, Tag } from "@chakra-ui/react"
import { useState } from "react"
import { Field } from "../ui/field";
import { useStore } from "@nanostores/react";
import { $allergenTable } from "@/lib/store";
import pluralize from 'pluralize';

const AutoAllergens = ({
    ingredients,
    tags,
    setTags,
    editableTags,
    setEditable
}: {
    ingredients: string[],
    tags: string[],
    setTags: any,
    editableTags: string[],
    setEditable: any
}) => {

    const allergenTable = useStore($allergenTable);
    const allergens = allergenTable.map(allergen => allergen.name);

    const matchAllergens = (allergenList: string[], textArray: string[]) => {
        // make sure these are all singular so that they match
        const singularAllergens:string[] = allergenList.map(allergen => pluralize(allergen)); 
        const singularTextArray: string[] = textArray.map(allergen => pluralize(allergen)); 
        const matchedAllergens = singularAllergens.filter(allergen =>
            singularTextArray.some(text => new RegExp(`\\b${allergen}\\b`, 'i').test(text))
        );
    
        setTags(matchedAllergens); // Update state with matched allergens
    };

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
            <Button variant="outline" onClick={() => matchAllergens(allergens, ingredients)}>
                Auto-generate
            </Button>
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