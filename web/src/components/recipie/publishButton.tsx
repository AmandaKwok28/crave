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
import { openPage } from "@nanostores/router";
import { $router } from "@/lib/router";
import { useStore } from "@nanostores/react";
import { $currIngredientsList, resetIngredientsList } from "@/lib/store";

type PublishRecipeProps = {
    title: string;
    description: string;
    instructions: string;
}

const PublishRecipeButton = ({ title, description, instructions }: PublishRecipeProps ) => {
    const { addNewRecipe } = useMutationRecipes();
    let ingredientsList = useStore($currIngredientsList);

    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        addNewRecipe(title, description, ingredientsList, instructions);
        resetIngredientsList()
        openPage($router, 'home')
    };


  return (
    <DialogRoot size="md">
    <DialogTrigger asChild>
        <Button p="4" size="lg" bg="green.600" color="white">
            Publish
        </Button>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
        <DialogTitle textStyle="2xl" fontWeight="bold">Publish Recipe?</DialogTitle>
        </DialogHeader>
        <DialogBody>
        <p>
            Are you sure you want to publish this recipe? You will not be able to further edit this recipie after doing so.
        </p>
        </DialogBody>
        <DialogFooter>
        <DialogActionTrigger asChild>
            <Button p="4" size="lg" bg="Black" color="white">
                No
            </Button>
        </DialogActionTrigger>
            <Button p="4" size="lg" bg="green.600" color="white" onClick={handleSave}>
                Yes
            </Button>
        </DialogFooter>
        <DialogCloseTrigger />
    </DialogContent>
    </DialogRoot>
  )
}

export default PublishRecipeButton;