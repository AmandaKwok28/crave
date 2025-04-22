import { Button, IconButton, Text } from "@chakra-ui/react"
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
import { UserX } from "lucide-react";
import { toaster } from "../ui/toaster";
import useMutationParty from "@/hooks/party/use-mutation-party";
import { useAuth } from "@/hooks/use-auth";

const LeavePartyButton = ({ party_id, user_id }: { party_id: string, user_id: string} ) => {
  const { deletePartyMemberById } = useMutationParty();
  const { user } = useAuth();

  const handleDelete = () => {
    deletePartyMemberById(party_id, user_id)
      .then(() => redirectPage($router, 'profile',  { userId: user.id }))
      .catch(() => toaster.create({
        title: 'Error deleting party',
        description: 'Please try again later'
      }));
  };

  return (
    <DialogRoot size='xl'>
      <DialogTrigger asChild>
        <IconButton variant='ghost' color='red.400'>
          <UserX />
        </IconButton>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle textStyle="2xl" fontWeight="bold">Leave Party</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Text whiteSpace='pre-line'>
            Are you sure you want to leave this collaborative cooking Party?
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
            Leave
          </Button>
        </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}

export default LeavePartyButton;