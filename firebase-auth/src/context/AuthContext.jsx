import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import speakeasy from "speakeasy";

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
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        localStorage.setItem("totp", JSON.stringify(totpSecret));
    }
    , [totpSecret]);

    // ESTO ES UN EJEMPLO DE CÓMO GENERAR UN SECRET PARA TOTP
    // COMO ES UN SPIKE LO HAGO DESDE EL FRONTEND
    // PERO EN UN PROYECTO REAL HAY QUE HACERLO DESDE EL BACKEND
    
    const generateSecret = () => {
        const secret = speakeasy.generateSecret({
            length: 20,
            name: "firebase-auth",
            issuer: "DiegoGarciaPadilla",
        });
        return {base32: secret.base32, otpauth_url: secret.otpauth_url};
    }

    const verifyToken = (token, secret) => {
        console.log("Verifying token:", token, "with secret:", secret);
        const verified = speakeasy.totp.verify({
            secret: secret,
            token: token,
            window: 2
        });
        return verified;
    }

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
                generateSecret,
                verifyToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, useAuth, AuthProvider };
