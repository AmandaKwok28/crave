import NavBar from "@/components/layout/navBar";
import { Slider } from "@/components/ui/slider";
import { Box, Flex, Input, Text, Tag} from "@chakra-ui/react";
import useQueryRecipes from "@/hooks/use-query-recipes";
import Recipes from "@/components/recipie/recipes";
import TagInput from "@/components/search/tagInput";
import VerticalCheckBoxes from "@/components/search/DifficultyButtons";
import { Search as SearchIcon } from "lucide-react";
import { useStore } from "@nanostores/react";
import { $searchTags, removeSearchTags, setDeletedSearchTag, setFilters } from "@/lib/store";
import { Cuisine, Difficulty } from "@/data/types";
import CuisineCheckBoxes from "@/components/search/cuisineCheckBoxes";
import Prices from "@/components/search/prices";
import { useState } from "react";
// TODO: Create Tag component, store tags in nanostore not local state
// TODO: Create Dropdown component (?)
// TODO: Fix color schemes 
// TODO: Get recipes from store!

const Search = () => {
    const { recipes } = useQueryRecipes();

    const [cookTime, setCookTime] = useState<[number, number]>([10, 20]);
    const searchTags = useStore($searchTags);
    const handleRemove = (tag:string) => {
        setDeletedSearchTag(tag);
        removeSearchTags(tag);
    }

    const handleCookTimeChange = (details: { value: [number, number] }) => {
        setCookTime(details.value);
        const change = {
            prepTimeMin: details.value[0],
            prepTimeMax: details.value[1],
        }
        setFilters(change);
    }

    return (
    <Flex direction="column" h="100vh" overflowX="hidden">

        <NavBar/>

        <Flex mt="4vh" flex="1">

            {/* Side bar */}
            <Box w="400px"
                bgGradient='to-r' gradientFrom="purple.500" gradientTo="cyan.300"
                p="4"
            >
            
                <Text 
                    fontWeight="bold" 
                    mb="6" 
                    textAlign="center"
                    fontSize="25px"
                    color="white"
                >
                    Start Your Search
                </Text>

                <Flex direction="column" gap="8">

                    {/* Search bar */}
                    <Flex direction="row" alignItems="center">
                        <SearchIcon color="white" />
                        <Input
                            placeholder="Find the recipes you crave..."
                            variant="flushed"
                            color="white"
                            _placeholder={{ color: 'white' }}
                            p="2"
                        >
                        </Input>
                    </Flex>

                    {/* Prices $, $$, $$$, $$$$  //TODO: change btn color when selected */}
                    <Prices />
                    
                    {/* Cook Time */}
                    <Slider 
                        min={0}
                        max={120}
                        size="sm"
                        variant="solid"
                        defaultValue={cookTime}
                        value={cookTime}
                        label="Cook Time"
                        marks={[
                            { value: 0, label: "0" },
                            { value: 60, label: "1h" },
                            { value: 120, label: "2h+" },
                        ]}
                        color="white"
                        colorPalette="purple"
                        onValueChange={handleCookTimeChange}
                    >
                    </Slider>

                    <Flex direction="row" gap="6">
                        
                        <CuisineCheckBoxes 
                            title={"cuisine"} 
                            options={Object.values(Cuisine)} 
                            color={"white"} 
                        />


                        {/* Difficulty: Dropdown */}
                        <VerticalCheckBoxes 
                            title={"difficulty"} 
                            options={Object.values(Difficulty)} 
                            color="white"
                        />
                        
                    </Flex>

                    {/* Grocery Stores */}
                    <TagInput 
                        title={"Grocery Stores"}
                        placeholder={"CharMar"}
                    />
                    
                    {/* Ingredients List */}
                    <TagInput
                        title={"Ingredients"}
                        placeholder={"Nutella"}
                    />

                    {/* Major */}
                    <TagInput
                        title={"Major"}
                        placeholder={"Computer Science"}
                    />

                    {/* Year */}
                    <TagInput
                        title={"Class Year"}
                        placeholder={"Seniors"}
                    />

                    {/* Allergies */}
                    <TagInput
                        title={"Allergies"}
                        placeholder={"Peanuts"}
                    />
                    
                    {/* Meal Type: Checkbox */}
                    <TagInput 
                        title={"Meal Type"}
                        placeholder={"snack, dinner, brunch, etc..."}
                    />
        
                   
                    <Box mb="12">

                    </Box>
                   

                    
                </Flex>
            </Box>

            {/* the cards... */}
            <Flex flex="1" bg="white" p="2" direction="column" gap="2" wrap="wrap" w="full">
                <Box
                    h="3vh"
                    w="75vw"
                    overflowX="auto"
                    alignContent="center"
                    spaceX="2"
                    overflowY="hidden"
                >
                    {/* //TODO get remove tag on the top bar to remove it on the side bar also */}
                    {searchTags.map((tag, index) => (
                        <Tag.Root 
                            key={index} 
                            variant="subtle" 
                            size="lg" 
                            w="fit-content"
                            bgGradient='to-r' gradientFrom="purple.500" gradientTo="cyan.300"
                            color="white"
                            borderRadius="10px"
                        >
                            <Tag.Label>{tag}</Tag.Label>
                            <Tag.EndElement>
                                <Tag.CloseTrigger onClick={() => handleRemove(tag)}/>
                            </Tag.EndElement>
                        </Tag.Root>
                    ))}
                </Box>
                <Recipes recipes={recipes} />
            </Flex>
        </Flex>
    </Flex>

    )
}

export default Search;