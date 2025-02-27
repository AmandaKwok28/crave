// import { fetchUsers } from "@/data/api";
// import { $users, setUsers } from "@/lib/store";
// import { useStore } from "@nanostores/react";
// import { useEffect } from "react";

// const useQueryUsers = () => {
//     const users = useStore($users);
//     const loadUsers = async () => {
//         try {
//           const fetchedUsers = await fetchUsers();
//           setUsers([...fetchedUsers]);
//         } catch (error) {
//         }
//       };

//     useEffect(() => {
//         loadUsers();
//     }, [])

//     return {
//         users,
//     }
// }

// export default useQueryUsers;