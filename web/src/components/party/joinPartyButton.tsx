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
import { redirectPage } from "@nanostores/router";
import { $router } from "@/lib/router";
import { Cuisine, Difficulty, PartyType, Price } from "@/data/types";
import { toaster } from "../ui/toaster";
import { useState } from "react";
import useMutationParty from "@/hooks/party/use-mutation-party";
import { useAuth } from "@/hooks/use-auth";
import { fetchPartyPrefs } from "@/data/api";

type JoinPartyProps = {
    party: PartyType,
    availableTime: number, 
    preferredCuisine: Cuisine, 
    ingredients: string[],
    excludedAllergens: string,
    preferredPrice: Price,
    preferredDifficulty: Difficulty 
}

const JoinPartyButton = ({ 
    party, 
    availableTime, 
    preferredCuisine, 
    ingredients, 
    excludedAllergens, 
    preferredPrice,
    preferredDifficulty
}: JoinPartyProps ) => {
    const { user } = useAuth()
    const { updatePartyPrefrences, joinParty } = useMutationParty();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    

    const handleSave = async () => {
        // only need to throw an error for incompletion iff they're trying to publish
        if (!availableTime || !preferredCuisine || !ingredients || !excludedAllergens || !preferredDifficulty) {
            toaster.create({
                title: 'Please fill out all required fields',
                type: "error"
            });
            setIsOpen(false);
            return;
        }
        //join the party
        if (user.id != party.host.id) {
           await joinParty(party.shareLink, ingredients, preferredDifficulty);
        }
        const partyPrefs = await fetchPartyPrefs(party.shareLink)

        if (partyPrefs.availableTime < availableTime) {
            availableTime = partyPrefs.availableTime;
        }
        if (partyPrefs.preferredPrice < preferredPrice) {
            preferredPrice = partyPrefs.preferredPrice;
        }
        if (partyPrefs.preferredDifficulty < preferredDifficulty) {
            preferredDifficulty = partyPrefs.preferredDifficulty;
        }
        const preferredCuisines: Cuisine[] = partyPrefs.preferredCuisines.concat([preferredCuisine]);
        const updatedingredients: string[] = partyPrefs.aggregatedIngredients.concat(ingredients);
        const updatedAllergens: string[] = partyPrefs.excludedAllergens.concat([excludedAllergens]);

        // update the partyPrefrences
        await updatePartyPrefrences(
            party.id,
            availableTime,
            preferredCuisines,
            updatedingredients,
            updatedAllergens,
            preferredPrice,
            preferredDifficulty,
        )
        setIsOpen(false);
        redirectPage($router, 'profile');
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
            bg="blue.400"
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