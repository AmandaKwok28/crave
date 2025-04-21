import { UserType } from "@/data/types";
import { $router } from "@/lib/router";
import { Dialog, Flex, Link, Portal, Spacer, Text} from "@chakra-ui/react"
import { openPage } from "@nanostores/router";

const Network = ({ group, name }: { group: UserType[], name: string }) => {
  return (
    <Dialog.Root scrollBehavior="inside" size="sm">
      <Dialog.Trigger asChild>
        <Text cursor="pointer">
          {name}
        </Text>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{name}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
            {group.map(user => (
              <Flex direction="row" key={user.id}>
                <Link 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    openPage($router, 'profile', { userId: user.id });
                  }}
                  fontWeight="bold"
                  color="teal.600"
                  variant="plain"
                >
                  {user.name}
                </Link>
                <Spacer/>
                <Text fontWeight="lighter">{user.major}</Text>
              </Flex>
            ))}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default Network;