import NavBar from "@/components/layout/navBar";
import {Box, 
        Button, 
        Flex, 
        Input, 
        Spacer, 
        Text } from "@chakra-ui/react";
import useQueryRecipes from "@/hooks/use-query-recipes";
import Recipes from "@/components/recipie/recipes";
import { SearchIcon } from "lucide-react";
import { setFilters, setSearchTerm } from "@/lib/store";
import Prices from "@/components/search/prices";
import DifficultyButtons from "@/components/search/DifficultyButtons";
import { Difficulty } from "@/data/types";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { openPage } from "@nanostores/router";
import { $router } from "@/lib/router";

const Home = () => {
    const { recipes } = useQueryRecipes(true);
    
    const [cookTime, setCookTime] = useState<[number, number]>([10, 20]);
    const handleCookTimeChange = (details: { value: [number, number] }) => {
        setCookTime(details.value);
        const change = {
            prepTimeMin: details.value[0],
            prepTimeMax: details.value[1],
        }
        setFilters(change);
    }
    
    return (
        <Flex
            direction="column"
            className="min-h-screen"
            style={{ backgroundColor: "white" }}
        >
            <NavBar />

            {/* App Name */}
            <Flex 
                direction="row"
                bgGradient="to-r"
                gradientFrom="cyan.500"
                gradientTo="purple.600"
                h="60vh" 
                className="w-screen"
                mt="4"
            >
                <Box
                    alignContent="center"
                    p="16px"
                    ml="4"
                >
                    <Text
                        textStyle="7xl"
                        fontWeight="bold"
                        color='bg'
                    > 
                        Crave. 
                    </Text>
                    <Text
                        textStyle="2xl"
                        fontWeight="bold"
                        color="gray.300"
                    > 
                        A recipe crowdsouring app for college students.
                    </Text>
                </Box>

                <Spacer/>

                {/* Home Page Search Box */}
                <Flex 
                    //background="gray.200"
                    backgroundColor="rgba(211, 211, 211, 0.4)"
                    w="55vw"
                    m="7vh"
                    direction="column"
                    borderRadius="20px"
                >

                <Flex 
                    direction="column" 
                    gap="8"
                    p="12"
                >

                    {/* Search bar */}
                    <Flex direction="row" alignItems="center">
                        <SearchIcon color="white" />
                        <Input
                            placeholder="Find the recipes you crave..."
                            fontSize="large"
                            variant="flushed"
                            color="white"
                            _placeholder={{ color: 'white' }}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            p="2"
                        >
                        </Input>
                    </Flex>

                    <Prices />

                    <Box >
                        <DifficultyButtons 
                            title="Difficulty" 
                            options={Object.values(Difficulty)} 
                            color="white" 
                            home={true}
                        />
                    </Box>
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


                    <Button 
                        borderRadius="10px"
                        bgGradient="to-l"
                        gradientFrom="cyan.500"
                        gradientTo="purple.600"
                        onClick={() => openPage($router, "search")}
                    >
                        Search
                    </Button>

                    

                </Flex>
                </Flex>
            </Flex>
            <Box 
                bg="white" 
                flex="1" 
                className="w-screen">
                <Text 
                    textStyle="2xl"
                    color="black"
                    fontWeight="bold"
                    m="4"> 
                    Trending
                </Text>
                <Flex direction="row" m="4" gap="6" wrap="wrap">
                    <Recipes recipes={recipes}/>
                </Flex>
            </Box>
        </Flex>
    )
}

export default Home;