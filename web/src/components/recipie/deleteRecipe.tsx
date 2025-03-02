import { Button, Highlight } from "@chakra-ui/react"
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
import useMutationRecipe from "@/hooks/use-mutation-recipes";
import { RecipeType } from "@/data/types";
import { openPage } from "@nanostores/router";
import { $router } from "@/lib/router";

const DeleteRecipe = ({ recipe }: {recipe: RecipeType} ) => {

    const { deleteRecipeById } = useMutationRecipe();

    const handleDelete = async () => {
        await deleteRecipeById(recipe.id);
        openPage($router, "home");
    };

  return (
    <DialogRoot size="md">
    <DialogTrigger asChild>
        <Button p="4" size="lg" bgGradient="to-r" gradientFrom="red.300" gradientTo="orange.300" color="white">
            Delete
        </Button>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
        <DialogTitle textStyle="2xl" fontWeight="bold">Delete Recipe?</DialogTitle>
        </DialogHeader>
        <DialogBody>
            <Highlight query="Warning:" styles={{ px: "0.5", bg: "orange.subtle", color: "orange.fg" }}>
                Do you want to delete this recipe? Warning: you cannot undo this action.
            </Highlight>
        </DialogBody>
        <DialogFooter>
        <DialogActionTrigger asChild>
            <Button p="4" size="lg" bg="gray.400" color="white">
                Back
            </Button>
        </DialogActionTrigger>
            <Button p="4" size="lg" bgGradient="to-r" gradientFrom="red.300" gradientTo="orange.300" color="white" onClick={handleDelete}>
                Delete
            </Button>
        </DialogFooter>
        <DialogCloseTrigger />
    </DialogContent>
    </DialogRoot>
  )
}

export default DeleteRecipe;