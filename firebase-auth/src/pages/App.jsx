import { Routes, Route } from "react-router";
import { AuthProvider } from "../context/AuthContext";
import { SignUpProvider } from "../context/SignUpContext";
import { PrivateRoute } from "../components/PrivateRoute";
import { Home } from "./Home";
import { Login } from "./Login";
import { SignUp } from "./SignUp";

export const App = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route
                    index
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/signup"
                    element={
                        <SignUpProvider>
                            <SignUp />
                        </SignUpProvider>
                    }
                />
            </Routes>
        </AuthProvider>
    );
};
