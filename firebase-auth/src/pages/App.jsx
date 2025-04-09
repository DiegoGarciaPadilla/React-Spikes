import { Routes, Route } from "react-router";
import { AuthProvider } from "../context/AuthContext";
import { PrivateRoute } from "../components/PrivateRoute";
import { Home } from "./Home";
import { Login } from "./Login";
import { SignUp } from "./SignUp";

export const App = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </AuthProvider>
    );
};
