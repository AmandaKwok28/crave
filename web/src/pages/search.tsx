import NavBar from "@/components/layout/navBar";
import { Button, Center, Flex, Stack, Text } from "@chakra-ui/react";
import useQueryRecipes from "@/hooks/use-query-recipes";
import Recipes from "@/components/recipie/recipes";
import SearchSummary from "@/components/search/searchSummary";
import Sidebar from "@/components/search/sidebar";
import { useStore } from "@nanostores/react";
import { $showSearchTrending, setShowSearchTrending } from "@/lib/store";
import Trending from "@/components/search/trending";

const Search = () => {
    const { recipes, loadRecipes } = useQueryRecipes();
    const showSearchTrending = useStore($showSearchTrending);

    return (
    <Flex direction="column" h="100vh" overflowX="hidden">
        <NavBar/>
        <Flex mt="4vh" flex="1" gap="5" w="full">
            <Sidebar />
            <Flex 
                flex="1" 
                bg="white" 
                p="2" 
                direction="column" 
                gap="2" 
                wrap="wrap" 
                w="full">
                <Center mt="2rem" gap="10" align-items="center" w="100%"> 
                    <Button variant="plain" disabled={!showSearchTrending}> 
                        <Text textStyle="2xl" fontWeight="semibold" onClick={() => setShowSearchTrending(false)} > 
                            Search
                        </Text>
                    </Button>
                    <Button variant="plain" disabled={!!showSearchTrending}> 
                        <Text textStyle="2xl" fontWeight="semibold" onClick={() => setShowSearchTrending(true)}> 
                            Trending
                        </Text>
                    </Button>
                </Center>
                {!showSearchTrending && (<Stack> <SearchSummary /> <Recipes recipes={recipes} loadRecipes={loadRecipes}/> </Stack>)}
                {showSearchTrending && (<Trending recipes={recipes} />)}  
            </Flex>
        </Flex>
    </Flex>

    )
}

export default Search;