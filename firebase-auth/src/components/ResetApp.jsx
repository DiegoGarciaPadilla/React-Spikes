import { useAuth } from "../hooks/useAuth";
import { useSignUp } from "../hooks/useSignUp";

export const ResetApp = () => {

    const { setError, signOut, setTotpSecret } = useAuth();
    const { setStage } = useSignUp();

    const handleClick = async () => {
        setError(null);
        try {
            await signOut();
            setTotpSecret(null);
            localStorage.removeItem("totp");
            setStage(0);
        } catch (error) {
            console.error("Error signing out: ", error);
            setError("Error signing out: " + error.message);
        }
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