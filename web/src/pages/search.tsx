import NavBar from "@/components/layout/navBar";
import { Slider } from "@/components/ui/slider";
import { Box, Button, createListCollection, Flex, Input, Stack, Text} from "@chakra-ui/react";
import { IoIosSearch } from "react-icons/io";
import { Tag } from "@chakra-ui/react"
import { useState } from "react";
import {
    SelectContent,
    SelectItem,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
  } from "@/components/ui/select"
import RecipeCard from "@/components/layout/recipeCard";
import { RecipeType } from "@/data/types";
import useQueryRecipes from "@/hooks/use-query-recipes";

// TODO: Create Tag component, store tags in nanostore not local state
// TODO: Create Dropdown component (?)
// TODO: Fix color schemes 
// TODO: Get recipes from store!

const Search = () => {
    const [inputValue, setInputValue] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const { recipes } = useQueryRecipes();
  
    const handleInputChange = (e: any) => {
      setInputValue(e.target.value);
    };
  
    const handleKeyDown = (e: any) => {
      if (e.key === "Enter" && inputValue.trim() !== "") {
        setTags([...tags, inputValue.trim()]);
        setInputValue("");
      }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const difficulty = createListCollection({
        items: [
          { label: "Easy", value: "easy" },
          { label: "Medium", value: "medium" },
          { label: "Hard", value: "hard" },
        ],
    });

    const cuisine = createListCollection({
        items: [
          { label: "Italian", value: "italian" },
          { label: "Indian", value: "indian" },
          { label: "Chinese", value: "chinese" },
        ],
    });

    return (
    <Flex direction="column" h="100vh">
        <NavBar/>
        <Flex flex="1">
            <Box w="400px"
                //bgGradient='to-r' gradientFrom="cyan.700" gradientTo="cyan.400"
                bg="gray.700"
                p="4">
                <Text 
                    fontWeight="bold" 
                    mb="6" 
                    textAlign="center"
                    fontSize="25px">
                    Start Your Search
                </Text>

                <Flex direction="column" gap="8">
                    <Input
                        placeholder=" Find the recipes you crave..."
                        variant="subtle"
                        color="white">
                    </Input>

                    <Slider 
                        min={0}
                        max={50}
                        size="sm"
                        variant="solid"
                        defaultValue={[10, 20]}
                        label="Price"
                        marks={[
                            { value: 0, label: "0" },
                            { value: 25, label: "25" },
                            { value: 50, label: "50+" },
                        ]}
                    >
                    </Slider>

                    <Slider 
                        min={0}
                        max={120}
                        size="sm"
                        variant="solid"
                        defaultValue={[10, 20]}
                        label="Cook Time"
                        marks={[
                            { value: 0, label: "0" },
                            { value: 60, label: "1h" },
                            { value: 120, label: "2h+" },
                        ]}
                    >
                    </Slider>
                    
                    <Flex direction="column">
                        <Text
                        fontSize="sm"
                        mb="5px"
                        >
                            Grocery Stores
                        </Text>
                        <Input
                            placeholder=" e.g., CharMar "
                            variant="subtle"
                            color="white"
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

                    <Flex direction="column" mb="5">
                        <Text
                        fontSize="sm"
                        mb="5px"
                        >
                            Ingredients
                        </Text>
                        <Input
                            placeholder=" e.g., Asparagus "
                            variant="subtle"
                            color="white">
                        </Input>

                        {/* Create Tag Component */}

                        {/* <Flex wrap="wrap" gap="2" mt="2">
                            {tags.map((tag, index) => (
                            <Tag.Root key={index} variant="subtle" size="lg" w="fit-content">
                                <Tag.Label>{tag}</Tag.Label>
                                <Tag.EndElement>
                                    <Tag.CloseTrigger onClick={() => removeTag(tag)}/>
                                </Tag.EndElement>
                            </Tag.Root>
                            ))}
                        </Flex> */}

                    </Flex>

                    <Flex direction="row" mb="5">
                        <Stack gap="5" w="200px">
                            <SelectRoot
                                key="test" 
                                size="sm" 
                                collection={difficulty}
                                variant="subtle">
                                <SelectTrigger>
                                    <SelectValueText placeholder="Difficulty"/>
                                </SelectTrigger>
                                <SelectContent>
                                {difficulty.items.map((diff) => (
                                    <SelectItem item={diff} key={diff.value}>
                                    {diff.label}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </SelectRoot>
                        </Stack>

                        <Stack gap="5"  w="200px">
                            <SelectRoot
                                key="test" 
                                size="sm" 
                                collection={cuisine}
                                variant="subtle">
                                <SelectTrigger>
                                    <SelectValueText placeholder="Cuisine"/>
                                </SelectTrigger>
                                <SelectContent>
                                {cuisine.items.map((item) => (
                                    <SelectItem item={item} key={item.value}>
                                    {item.label}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </SelectRoot>
                        </Stack>
                    </Flex>

                    <Flex direction="row">
                        <Stack gap="5" w="200px">
                            <SelectRoot
                                key="test" 
                                size="sm" 
                                collection={difficulty}
                                variant="subtle">
                                <SelectTrigger>
                                    <SelectValueText placeholder="Something Else"/>
                                </SelectTrigger>
                                <SelectContent>
                                {difficulty.items.map((diff) => (
                                    <SelectItem item={diff} key={diff.value}>
                                    {diff.label}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </SelectRoot>
                        </Stack>

                        <Stack gap="5"  w="200px">
                            <SelectRoot
                                key="test" 
                                size="sm" 
                                collection={cuisine}
                                variant="subtle">
                                <SelectTrigger>
                                    <SelectValueText placeholder="Another Thing"/>
                                </SelectTrigger>
                                <SelectContent>
                                {cuisine.items.map((item) => (
                                    <SelectItem item={item} key={item.value}>
                                    {item.label}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </SelectRoot>
                        </Stack>
                    </Flex>
                </Flex>
            </Box>

            {/* the cards... */}
            <Flex flex="1" bg="white" p="2" direction="row" gap="2" wrap="wrap">
                {recipes.map((card:RecipeType) => (
                    <RecipeCard key={card.id} recipe={card} /> 
                ))}
            </Flex>
        </Flex>
    </Flex>

    )
}

export default Search;