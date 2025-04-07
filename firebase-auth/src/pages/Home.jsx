import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export const Home = () => {
    const { signOut, currentUser, loading } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut()
            .then(() => {
                alert("You have signed out successfully");
            })
            .catch((error) => {
                console.error("Error signing out: ", error);
            });
    };

    const goToLogin = () => {
        navigate("/login");
    };

    const handleClick = () => {
        if (currentUser) {
            handleSignOut();
        } else {
            goToLogin();
        }
    };

    if (loading) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="text-3xl font-bold">...</h1>
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-3xl font-bold">
                {currentUser
                    ? "Welcome to the Home Page, " + currentUser.email
                    : "Please Log In"}
            </h1>
            <button
                onClick={handleClick}
                className="w-60 bg-blue-600 mt-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
            >
                {currentUser ? "Cerrar sesión" : "Regresar a Login"}
            </button>
        </main>
    );
};
