import React, { createContext, useState } from "react";

const SignUpContext = createContext();

const SignUpProvider = ({ children }) => {
    const [stage, setStage] = useState(1);

    return (
        <SignUpContext.Provider value={{ stage, setStage }}>
            {children}
        </SignUpContext.Provider>
    );
};

export { SignUpContext, SignUpProvider };