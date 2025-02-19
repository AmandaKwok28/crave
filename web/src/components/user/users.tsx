import User from "./user";
import useQueryUsers from "@/hooks/use-query-users";

const Users = () => {
  const  { users } = useQueryUsers();

  return (
    <div>
        test2
      {users
        .map((user) => (
            <User key={user.id} user={user} />
        ))}
    </div>
  );
};

export default Users;