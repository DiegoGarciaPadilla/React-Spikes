import { useAuth } from "../hooks/useAuth";
import { useSignUp } from "../hooks/useSignUp";

export const ResetApp = () => {

    const { signOut, setTotpSecret } = useAuth();
    const { setStage } = useSignUp();

    const handleClick = () => {
        signOut()
            .then(() => {
                console.log("User signed out");
                setTotpSecret(null);
                localStorage.removeItem("totp");
            })
            .catch((error) => {
                console.error("Error signing out: ", error);
            });
        setStage(0);
    }

    return (
        <button
            onClick={handleClick}
            className="w-full bg-blue-600 mt-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
        >
            RESET
        </button>
    )
}