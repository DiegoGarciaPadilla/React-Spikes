import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export const PrivateRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="text-3xl font-bold">...</h1>
            </main>
        );
    }

    return currentUser ? children : <Navigate to="/login" />;
}