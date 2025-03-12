import TagInput from "@/components/search/tagInput";
import { Search as SearchIcon } from "lucide-react";
import { Box, Flex, Input, Text, Tag} from "@chakra-ui/react";
import { useStore } from "@nanostores/react";
import { $filters, $searchTerm, setFilters, setSearchTerm } from "@/lib/store";
import Prices from "./prices";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import CuisineCheckBoxes from "./cuisineCheckBoxes";
import DifficultyButtons from "./DifficultyButtons";
import { Cuisine, Difficulty } from "@/data/types";


const Sidebar = () => {
    const searchTerm = useStore($searchTerm);
    const filters = useStore($filters);
    
    const [cookTime, setCookTime] = useState<[number, number]>([
        filters.prepTimeMin ?? 10, 
        filters.prepTimeMax ?? 20
        ]);

    const handleCookTimeChange = (details: { value: [number, number] }) => {
        setCookTime(details.value);
        const change = {
            prepTimeMin: details.value[0],
            prepTimeMax: details.value[1],
        }
        setFilters(change);
    }

    return (
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
                    value={searchTerm}
                    _placeholder={{ color: 'white' }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    p="2"
                >
                </Input>
            </Flex>

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

                <DifficultyButtons 
                    title="Difficulty" 
                    options={Object.values(Difficulty)} 
                    color="white"
                    home={false}
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

    );
};

export default Sidebar;