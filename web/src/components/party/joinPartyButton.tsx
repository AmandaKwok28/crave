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
import { publishRecipe } from "@/data/api";
import { redirectPage } from "@nanostores/router";
import { $router } from "@/lib/router";
import { Cuisine, Difficulty, Price } from "@/data/types";
import { toaster } from "../ui/toaster";
import { useState } from "react";

type JoinPartyProps = {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    draft_id?: number;
    mealTypes?: string[];
    price: Price,
    cuisine: Cuisine,
    allergens: string[],
    difficulty: Difficulty,
    sources?: string[],
    prepTime: number,
    image?: string
}

const JoinPartyButton = ({ 
    title, 
    description, 
    ingredients, 
    instructions, 
    draft_id, 
    mealTypes, 
    price,
    cuisine,
    allergens,
    difficulty,
    sources,
    prepTime,
    image, 
}: JoinPartyProps ) => {
    const { user } = useAuth();
    const { addNewRecipe, editRecipe } = useMutationRecipes();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleSave = async () => {
        // only need to throw an error for incompletion iff they're trying to publish
        if (!title || !description || !ingredients || !instructions) {
            toaster.create({
                title: 'Please fill out all required fields',
                type: "error"
            });
            setIsOpen(false);
            return;
        }

        if (!price || !cuisine || !allergens || !difficulty || !prepTime) {
            toaster.create({
                title: 'Please fill out the necessary additional information'
            })
            setIsOpen(false);
            return;
        }

        console.log(difficulty)
        await editRecipe(
            title, 
            description, 
            ingredients, 
            instructions, 
            true,
            mealTypes ? mealTypes : [], 
            price,
            cuisine,
            allergens,
            difficulty,
            sources ? sources : [],
            prepTime
        );
        redirectPage($router, `profile`);
    };

    return (
        <DialogRoot size="md" open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
            <DialogTrigger asChild>
            <Button 
            variant="subtle" 
            //bgImage="linear-gradient({colors.blue.500}, {colors.cyan.200})"
            color="white" 
            //borderRadius="15px" 
            border="non"
            bg="cyan.700"
            >
                Join Party
            </Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
            <DialogTitle textStyle="2xl" fontWeight="bold">Join Collaborative Cooking Session?</DialogTitle>
            </DialogHeader>
            <DialogBody>
            <p>
                Are you sure you want to join this cooking party? You will not be able to further update your prefrences after doing so.
            </p>
            </DialogBody>
            <DialogFooter>
            <DialogActionTrigger asChild>
                <Button p="4" size="lg" bg="gray.400" color="white">
                    No
                </Button>
            </DialogActionTrigger>
                <Button p="4" size="lg" bgGradient="to-r" gradientFrom="teal.300" gradientTo="green.400" color="white" onClick={handleSave}>
                    Yes
                </Button>
            </DialogFooter>
            <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    )
}

export default JoinPartyButton;