import { UserType } from "@/data/types";
import { Text } from "@chakra-ui/react"

type UserProps = {
  user: UserType;
};

const User = ({ user }: UserProps) => {
  return (
    <Text>
        Test user:
        {user.name}
    </Text>
  )
};

export default User;