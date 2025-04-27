import { Routes, Route } from "react-router";
import { SignUpProvider } from "../context/SignUpContext";
import { PrivateRoute } from "../components/PrivateRoute";
import { Home } from "./Home";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import { useAuth } from "../hooks/useAuth";

export const App = () => {
    const { registerRecaptcha } = useAuth();
    return (
        <>
            <div
                id="recaptcha-container"
                ref={registerRecaptcha}
                style={{ display: "none" }}
            />
            <Routes>
                <Route
                    index
                element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                }
            />
            <Route path="login" element={<Login />} />
            <Route
                path="signup"
                element={
                    <SignUpProvider>
                        <SignUp />
                    </SignUpProvider>
                }
            />
        </Routes>
        </>
    );
};
