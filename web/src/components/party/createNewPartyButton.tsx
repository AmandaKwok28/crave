import { Button, Input } from "@chakra-ui/react"
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
import { useState } from "react";
import { Field } from "../ui/field";
import useMutationParty from "@/hooks/party/use-mutation-party";
import { toaster } from "../ui/toaster";

const CreateNewPartyButton = () => {
    const { addNewParty } = useMutationParty();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [ title, setTitle ] = useState<string>('');

    const handleSave = async () => {
        if (!title) {
            toaster.create({
                title: 'Please enter a Party title for your Collaborative Cooking Session',
                type: "error"
            });
            return;
        } else {
            const newParty = await addNewParty(title);  
            redirectPage($router, 'createParty', { share_link: newParty.shareLink });
            setTitle("");
            setIsOpen(false);
        }
    };
    
  return (
    <DialogRoot size="md" open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
    <DialogTrigger asChild>
    <Button size="xs" bgGradient="to-r" gradientFrom="teal.300" gradientTo="green.400" color="white" >
           Create New Party
        </Button>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
        <DialogTitle textStyle="xl" fontWeight="bold">Create a New Collaborative Cooking Party</DialogTitle>
        </DialogHeader>
        <DialogBody pb="4">
            <Field label='Party Title' required w='50rem' maxW='80%'>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Enter a party title...'
                />
            </Field>
        </DialogBody>
        <DialogFooter>
        <DialogActionTrigger asChild>
            <Button p="4" size="lg" bg="gray.400" color="white" >
                Cancel
            </Button>
        </DialogActionTrigger>
            <Button p="4" size="lg" bgGradient="to-r" gradientFrom="teal.300" gradientTo="green.400" color="white" onClick={() => handleSave()}>
                Create
            </Button>
        </DialogFooter>
        <DialogCloseTrigger />
    </DialogContent>
    </DialogRoot>
  )
}

export default CreateNewPartyButton;