import { useContext } from "react";
import { SignUpContext } from "../context/SignUpContext";

export const useSignUp = () => {
    const context = useContext(SignUpContext);
    if (!context) {
        throw new Error("useSignUp must be used within a SignUpProvider");
    }
    return context;
};
