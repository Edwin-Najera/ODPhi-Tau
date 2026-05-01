import { auth } from "../firebase";

export const getUserRole = (callback: (role: string | null) => void) => {
    return auth.onAuthStateChanged(async (user) =>  {
        if (!user) {
            callback(null);
            return;
        }

        const tokenResult = await user.getIdTokenResult();
        callback(tokenResult.claims.role as string);
    })
};