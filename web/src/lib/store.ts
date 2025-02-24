import { UserType } from "@/data/types";
import { persistentAtom } from "@nanostores/persistent";

export const $user = persistentAtom<UserType>('user', {
  id: '',
  email: '',
  name: '',
  school: '',
  year: 0
}, {
  encode: JSON.stringify,
  decode: JSON.parse
});

export function clearUser() {
  $user.set({
    id: '',
    email: '',
    name: '',
    school: '',
    year: 0  
  });
}

export function setUser(user: UserType) {
  $user.set(user);
}
