import { createContext, useContext, useEffect, useState } from "react";

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
    }
    , [stage]);


    return (
        <SignUpContext.Provider value={{ stage, setStage }}>
            {children}
        </SignUpContext.Provider>
    );
};

export { useSignUp, SignUpProvider };