import { useContext } from "react";
import { LoginContext } from "../context/LoginContext";

export const useLogin = () => {
    const context = useContext(LoginContext);
    if (!context) {
        throw new Error("useLogin must be used within a LoginProvider");
    }
    return context;
};
