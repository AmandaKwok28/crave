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

type PublishRecipeProps = {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
}

const DraftButton = ({ title, description, ingredients, instructions }: PublishRecipeProps ) => {
    const { addNewRecipeDraft } = useMutationRecipes();
    const { user } = useAuth();

    const handleSave = async () => {
        await addNewRecipeDraft(title, description, ingredients, instructions, user.id);
        openPage($router, "profile");
    };

  return (
    <DialogRoot size="md">
    <DialogTrigger asChild>
        <Button bgGradient="to-r" gradientFrom="cyan.300" gradientTo="blue.400" color="white">
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