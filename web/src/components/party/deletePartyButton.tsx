import { Button, Em, IconButton, Text } from "@chakra-ui/react"
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
import { Trash } from "lucide-react";
import { toaster } from "../ui/toaster";
import useMutationParty from "@/hooks/party/use-mutation-party";

const DeletePartyButton = ({ party_id }: { party_id: string } ) => {
  const { deletePartyById } = useMutationParty();

  const handleDelete = () => {
    deletePartyById(party_id)
      .then(() => redirectPage($router, 'profile'))
      .catch(() => toaster.create({
        title: 'Error deleting party',
        description: 'Please try again later'
      }));
  };

  return (
    <DialogRoot size='md'>
      <DialogTrigger asChild>
        <IconButton variant='ghost' color='red.400'>
          <Trash />
        </IconButton>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle textStyle="2xl" fontWeight="bold">Delete Party</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Text whiteSpace='pre-line'>
            Are you sure you want to delete this Party?{'\n\n'}
            <Em color='orange.fg'>
              You cannot undo this action.
            </Em>
          </Text>
        </DialogBody>
        <DialogFooter>
        <DialogActionTrigger asChild>
          <Button p="4" size="lg" bg="gray.400" color="white">
            Cancel
          </Button>
        </DialogActionTrigger>
        <DialogActionTrigger asChild>
          <Button p="4" size="lg" bgGradient="to-r" gradientFrom="red.300" gradientTo="orange.300" color="white" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}

export default DeletePartyButton;