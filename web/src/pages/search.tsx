import NavBar from "@/components/layout/navBar";
import { Flex} from "@chakra-ui/react";
import useQueryRecipes from "@/hooks/use-query-recipes";
import Recipes from "@/components/recipie/recipes";
import SearchSummary from "@/components/search/searchSummary";
import Sidebar from "@/components/search/sidebar";

const Search = () => {
    const { recipes } = useQueryRecipes();


    return (
    <Flex direction="column" h="100vh" overflowX="hidden">
        <NavBar/>
        <Flex mt="4vh" flex="1">
            <Sidebar/>
            <Flex flex="1" bg="white" p="2" direction="column" gap="2" wrap="wrap" w="full">
                <SearchSummary />
                <Recipes recipes={recipes} />
            </Flex>
        </Flex>
    </Flex>

    )
}

export default Search;