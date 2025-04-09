import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext();

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totpSecret, setTotpSecret] = useState(() => {
        try {
            const storedTotp = localStorage.getItem("totp");
            return storedTotp ? JSON.parse(storedTotp) : null;
        }
        catch (error) {
            console.error("Error parsing TOTP secret from localStorage:", error);
            return null;
        }
    });

    const signUp = (email, password) =>
        createUserWithEmailAndPassword(auth, email, password);

    const signIn = (email, password) =>
        signInWithEmailAndPassword(auth, email, password);

    const userSignOut = () => signOut(auth);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
            console.log("User state changed:", user);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        localStorage.setItem("totp", JSON.stringify(totpSecret));
    }
    , [totpSecret]);

    return (
        <AuthContext.Provider
            value={{
                signUp,
                signIn,
                signOut: userSignOut,
                currentUser,
                loading,
                totpSecret,
                setTotpSecret,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, useAuth, AuthProvider };
