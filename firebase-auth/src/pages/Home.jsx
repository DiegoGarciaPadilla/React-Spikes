import { useAuth } from "../context/AuthContext";

export const Home = () => {
    const { isLoggedIn } = useAuth();

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-3xl font-bold">
                {isLoggedIn ? "Welcome to the Home Page" : "Please Log In"}
            </h1>
        </main>
    );
};
