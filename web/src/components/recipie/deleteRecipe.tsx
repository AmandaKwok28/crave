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
import useMutationRecipe from "@/hooks/use-mutation-recipes";
import { RecipeType } from "@/data/types";

const DeleteRecipe = ({ recipe }: {recipe: RecipeType} ) => {

    const { deleteRecipeById } = useMutationRecipe();

    const handleDelete = async () => {
        await deleteRecipeById(recipe.id);
    };

  return (
    <DialogRoot size="md">
    <DialogTrigger asChild>
        <Button p="4" size="lg" bg="red.600" color="white">
            Delete
        </Button>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
        <DialogTitle textStyle="2xl" fontWeight="bold">Delete Recipe?</DialogTitle>
        </DialogHeader>
        <DialogBody>
        <p>
            Do you want to delete this recipe? Warning: you cannot undo this action.
        </p>
        </DialogBody>
        <DialogFooter>
        <DialogActionTrigger asChild>
            <Button p="4" size="lg" bg="Black" color="white">
                Back
            </Button>
        </DialogActionTrigger>
            <Button p="4" size="lg" bg="red.600" color="white" onClick={handleDelete}>
                Delete
            </Button>
        </DialogFooter>
        <DialogCloseTrigger />
    </DialogContent>
    </DialogRoot>
  )
}

export default DeleteRecipe;