import { LikeType, RecipeType } from "@/data/types";
import { Button, Flex, Input, Stack, Text } from "@chakra-ui/react";
import RecipeCard from "../layout/recipeCard";
import { $trendingrecipes, setTrendingRecipes } from "@/lib/store";
import { useStore } from "@nanostores/react";
import { useState } from "react";
import { Field } from "@/components/ui/field";

const TrendingRecipes = ({recipes}:{recipes:RecipeType[]}) => {
    if (recipes.length === 0) {
        return (
            <Text mt='14' fontSize='xl'>No recipes found, create one to get started!</Text>
        );
    }

    const trendingRecipes = useStore($trendingrecipes);

    const [ targetDate, setTargetDate ] = useState<string>('');

    const handleCalcTrending = () => {

        let searchDate: Date = new Date(targetDate);
        if (searchDate.toString() == "Invalid Date") {
            searchDate = new Date();
        }

        let trendingRecipes: [RecipeType, number][] = [];
        // calculate trending score for each recipe and store the top 5 in descending order
        recipes.forEach(async (recipe) => {
            const currRecipeLikes: LikeType[] = recipe.likesList;
            let currRecipeScore: number = 0;
            for (let i = 0; i < recipe.likes; i++) {
                currRecipeScore += 1 / (1 + Math.abs(searchDate.getTime() - new Date(currRecipeLikes[i].date).getTime()) );
            }
            
            // if trending list < 5 add to list
            if (trendingRecipes.length < 5) {
                trendingRecipes.push([recipe, currRecipeScore]);
            } else { // else sort trending list compare to smallest replace if curr recipe score is larger
                trendingRecipes.sort((a, b) => a[1] - b[1]);
                if(trendingRecipes[0][1] < currRecipeScore) {
                    trendingRecipes[0] = [recipe, currRecipeScore];
                }
            }
        });

        let tRecipes: RecipeType[] = [];

        trendingRecipes.sort((a, b) => b[1] - a[1]);
        for (let i = 0; i < trendingRecipes.length; i++) {
            tRecipes.push(trendingRecipes[i][0]);
        }
        setTrendingRecipes(tRecipes);
    };
    

    return (
        <Stack>
            <Flex>
                <Button 
                    borderRadius="10px"
                    bgGradient="to-l"
                    gradientFrom="cyan.500"
                    gradientTo="purple.600"
                    mr="3rem"
                    onClick={() => handleCalcTrending()}
                >
                    Find Trending Recipes
                </Button>
                <Field label="Enter target date here: ">
                    <Input
                        bg="white"
                        color="black"
                        placeholder="m-d-y"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                    >
                    </Input>
                </Field>
            </Flex>
            <Flex gap="10" wrap="wrap" justifyContent="center" w="full">
                {trendingRecipes.map((card:RecipeType) => (
                    <RecipeCard key={card.id} recipe={card} /> 
                ))}
            </Flex>
        </Stack>
    )
}

export default TrendingRecipes;