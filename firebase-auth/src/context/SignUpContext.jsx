import { createContext, useContext, useEffect, useState } from "react";
import speakeasy from "speakeasy";

const SignUpContext = createContext();

const useSignUp = () => {
    const context = useContext(SignUpContext);
    if (!context) {
        throw new Error("useSignUp must be used within a SignUpProvider");
    }
    return context;
}

const SignUpProvider = ({ children }) => {
    const [stage, setStage] = useState(() => {
        const storedStage = localStorage.getItem("signUpStage");
        return storedStage ? parseInt(storedStage, 10) : 0;
    });

    useEffect(() => {
        localStorage.setItem("signUpStage", stage);
        console.log("Stage changed to:", stage);
    }
    , [stage]);

    // ESTO ES UN EJEMPLO DE CÓMO GENERAR UN SECRET PARA TOTP
    // COMO ES UN SPIKE LO HAGO DESDE EL FRONTEND
    // PERO EN UN PROYECTO REAL HAY QUE HACERLO DESDE EL BACKEND
    
    const generateSecret = () => {
        const secret = speakeasy.generateSecret({
            length: 20,
            name: "firebase-auth",
            issuer: "DiegoGarciaPadilla",
        });
        return {bae32: secret.base32, otpauth_url: secret.otpauth_url};
    }

    const verifyToken = (token, secret) => {
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: "base32",
            token: token,
        });
        console.log("Token verified:", verified);
        return verified;
    }


    return (
        <SignUpContext.Provider value={{ stage, setStage, generateSecret, verifyToken}}>
            {children}
        </SignUpContext.Provider>
    );
};

export { useSignUp, SignUpProvider };