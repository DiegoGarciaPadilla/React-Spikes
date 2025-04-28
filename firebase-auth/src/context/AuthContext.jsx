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
    getMultiFactorResolver,
    PhoneMultiFactorGenerator,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const recaptchaVerifierRef = useRef(null);

    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verificationId, setVerificationId] = useState(null);
    const [resolver, setResolver] = useState(null);

    const signUp = (email, password) =>
        createUserWithEmailAndPassword(auth, email, password);

    const verifyEmail = () => sendEmailVerification(auth.currentUser);

    const signIn = async (email, password) => {
        try {
            const userCredentials = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            return { user: userCredentials.user, mfaPending: false };
        } catch (error) {
            if (error.code === "auth/multi-factor-auth-required") {
                const resolver = getMultiFactorResolver(auth, error);
                console.log("MFA required, resolver:", resolver);
                setResolver(resolver);
                
                // Start the second factor verification process by sending SMS
                const phoneInfoOptions = {
                    multiFactorHint: resolver.hints[0],
                    session: resolver.session
                };
                
                const phoneProvider = new PhoneAuthProvider(auth);
                try {
                    // Send verification code to the user's phone
                    const verificationId = await phoneProvider.verifyPhoneNumber(
                        phoneInfoOptions,
                        recaptchaVerifierRef.current
                    );
                    setVerificationId(verificationId);
                    console.log("SMS verification code sent");
                } catch (smsError) {
                    console.error("Error sending SMS verification:", smsError);
                    setError(smsError.message);
                    throw smsError;
                }
                
                return { user: null, mfaPending: true };
            } else {
                console.error("Error al iniciar sesión: ", error);
                setError(error.message);
                throw error;
            }
        }
    };

    const verifyLoginWithSmsCode = async (code) => {
        try {
            // Create credential using the verificationId from the SMS
            const credential = PhoneAuthProvider.credential(
                verificationId,
                code
            );
            
            // Create the multi-factor assertion
            const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credential);
            
            // Complete sign-in
            await resolver.resolveSignIn(multiFactorAssertion);
            console.log("MFA verification successful");
            return true;
        } catch (error) {
            console.error("Error al verificar el código SMS:", error);
            setError(error.message);
            throw error;
        }
    };

    const signInWithGoogle = () => {
        const googleProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleProvider);
    };

    const userSignOut = () => signOut(auth);

    const registerRecaptcha = useCallback((element) => {
        try {
            if (element && !recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current = new RecaptchaVerifier(
                    auth,
                    element.id,
                    { size: "invisible" }
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

    const enrollPhoneNumberWithCode = async (code) => {
        try {
            const credential = PhoneAuthProvider.credential(
                verificationId,
                code
            );
            const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credential);
            await multiFactor(auth.currentUser).enroll(
                multiFactorAssertion,
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
                verifyLoginWithSmsCode,
                signOut: userSignOut,
                currentUser,
                loading,
                signInWithGoogle,
                registerRecaptcha,
                startEnrollment,
                enrollPhoneNumberWithCode,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
