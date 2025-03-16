import { editAvatarUrl } from "@/data/api";
import { useAuth } from "./use-auth";
import { setUser } from "@/lib/store";

const useMutationUser = () => {
    const { user } = useAuth();
    
    const updateAvatar = async (url:string) => {
        try {
            const updatedUser = await editAvatarUrl(user.email, url);
            setUser(updatedUser);
        } catch (error) {
            console.error("⚠️ Error updating avatar:", error);
        }
    }

    return ({
        updateAvatar
    })

}

export default useMutationUser;