import { Button } from "@chakra-ui/react"
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import useMutationRecipes from "@/hooks/use-mutation-recipes";
import { useAuth } from "@/hooks/use-auth";
import { openPage } from "@nanostores/router";
import { $router } from "@/lib/router";
import { Cuisine, Difficulty, Price } from "@/data/types";

type PublishRecipeProps = {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    mealTypes?: string[];
    price: Price,
    cuisine: Cuisine,
    allergens: string[],
    difficulty: Difficulty,
    sources?: string[],
    prepTime: number,
}


const DraftButton = ({ 
    title, 
    description, 
    ingredients, 
    instructions,  
    mealTypes, 
    price,
    cuisine,
    allergens,
    difficulty,
    sources,
    prepTime 

}: PublishRecipeProps ) => {
    const { addNewRecipeDraft } = useMutationRecipes();
    const { user } = useAuth();

    const handleSave = async () => {
        await addNewRecipeDraft(
            title, 
            description, 
            ingredients, 
            instructions, 
            user.id,
            mealTypes ? mealTypes : [],
            price,
            cuisine,
            allergens,
            difficulty,
            sources ? sources : [],
            prepTime
        );
        openPage($router, "profile");
    };

  return (
    <DialogRoot size="md">
    <DialogTrigger asChild>
    <Button 
        variant="outline" 
        bgImage="linear-gradient({colors.blue.500}, {colors.cyan.200})"
        color="white" 
        borderRadius="15px" 
        border="non"
    >
            Save to Drafts
        </Button>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
        <DialogTitle textStyle="2xl" fontWeight="bold">Save to Drafts?</DialogTitle>
        </DialogHeader>
        <DialogBody>
        <p>
            Are you sure you want to save this recipe to Drafts? It will not be viewable to the public yet, but you can continue createing the recipe later.
        </p>
        </DialogBody>
        <DialogFooter>
        <DialogActionTrigger asChild>
            <Button p="4" size="lg" bg="gray.400" color="white">
                No
            </Button>
        </DialogActionTrigger>
            <Button p="4" size="lg" bgGradient="to-r" gradientFrom="cyan.300" gradientTo="blue.400" color="white" onClick={handleSave}>
                Yes
            </Button>
        </DialogFooter>
        <DialogCloseTrigger />
    </DialogContent>
    </DialogRoot>
  )
}

export default DraftButton;