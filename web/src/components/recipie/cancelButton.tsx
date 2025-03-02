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
import { openPage } from "@nanostores/router";
import { $router } from "@/lib/router";

const CancelCreateRecipeButton = () => {
  return (
    <DialogRoot size="md">
    <DialogTrigger asChild>
        <Button bgGradient="to-r" gradientFrom="red.300" gradientTo="orange.300" color="white">
            Cancel
        </Button>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
        <DialogTitle textStyle="2xl" fontWeight="bold">Cancel Recipie Creation?</DialogTitle>
        </DialogHeader>
        <DialogBody>
        <p>
            Do you want to cancel creating this recipe? you will loose all progress by doing so.
        </p>
        </DialogBody>
        <DialogFooter>
        <DialogActionTrigger asChild>
            <Button p="4" size="lg" bg="gray.400" color="white">
                No
            </Button>
        </DialogActionTrigger>
            <Button p="4" size="lg" bgGradient="to-r" gradientFrom="red.300" gradientTo="orange.300" color="white" onClick={() => openPage($router, 'home')}>
                Yes
            </Button>
        </DialogFooter>
        <DialogCloseTrigger />
    </DialogContent>
    </DialogRoot>
  )
}

export default CancelCreateRecipeButton;