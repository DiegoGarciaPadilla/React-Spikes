import { createContext, useEffect, useState, useRef, useCallback } from "react";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    PhoneAuthProvider,
    RecaptchaVerifier,
    multiFactor,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const recaptchaVerifierRef = useRef(null);

    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verificationId, setVerificationId] = useState(null);

    const signUp = (email, password) =>
        createUserWithEmailAndPassword(auth, email, password);

    const verifyEmail = () =>
        sendEmailVerification(auth.currentUser);

    const signIn = (email, password) =>
        signInWithEmailAndPassword(auth, email, password);

    const userSignOut = () => signOut(auth);

    const signInWithGoogle = () => {
        const googleProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleProvider);
    };

    const registerRecaptcha = useCallback((element) => {
        try {
            if (element && !recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current = new RecaptchaVerifier(
                    auth,
                    element.id,
                    { size: "invisible" },
                );
                recaptchaVerifierRef.current.render();
            }
        } catch (error) {
            console.error("Error al registrar el reCAPTCHA:", error);
            setError(error.message);
            throw error;
        }
    }, []);

    const startEnrollment = async (phoneNumber) => {
        if (!currentUser) throw new Error("No user signed in");
        if (!recaptchaVerifierRef.current)
            throw new Error("Recaptcha not initialized");

        try {
            const session = await multiFactor(currentUser).getSession();
            const phoneProvider = new PhoneAuthProvider(auth);
            const id = await phoneProvider.verifyPhoneNumber(
                { phoneNumber, session },
                recaptchaVerifierRef.current
            );
            setVerificationId(id);
        } catch (error) {
            console.error("Error al iniciar el enrolamiento:", error);
            setError(error.message);
            throw error;
        }
    };

    const confirmCode = async (code) => {
        try {
            const assertion = PhoneAuthProvider.credential(
                verificationId,
                code
            );
            await multiFactor(auth.currentUser).enroll(
                assertion,
                "Mi teléfono"
            );
            return true;
        } catch (error) {
            console.error("Error al confirmar el código:", error);
            setError(error.message);
            throw error;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
            if (user) {
                console.log("User signed in:", user);
            } else {
                console.log("No user signed in");
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                error,
                setError,
                signUp,
                verifyEmail,
                signIn,
                signOut: userSignOut,
                currentUser,
                loading,
                signInWithGoogle,
                registerRecaptcha,
                startEnrollment,
                confirmCode,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
