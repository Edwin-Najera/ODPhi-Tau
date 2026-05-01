import  { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import type { NavigateFunction } from "react-router-dom";


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

export const useAuthRole = () => {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setUserRole(null);
                setEmail(null);
                return;
            }

            setEmail(user.email);

            getUserRole((role) => setUserRole(role || "none"));
        })

        return () => unsubscribe();
    }, []);

    return {userRole, email};
}

export const useLogout = async (navigate: NavigateFunction) => {
    try {
          await signOut(auth);
          navigate("/login");
        } catch (error) {
          console.error("Logout Error:", error);
        }
}