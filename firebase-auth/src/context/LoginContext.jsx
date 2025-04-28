import { createContext, useState } from "react";

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
    const [stage, setStage] = useState(1);

    return (
        <LoginContext.Provider value={{ stage, setStage }}>
            {children}
        </LoginContext.Provider>
    );
};

export { LoginContext, LoginProvider };