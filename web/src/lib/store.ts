import { atom } from "nanostores";
import { UserType } from "@/data/types";

export const $users = atom<UserType[]>([]);
export function setUsers(users: UserType[]) {
    $users.set(users);
}
