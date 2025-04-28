import { useLogin } from "../hooks/useLogin";
import { LoginStep1 } from "../components/LoginStep1";
import { LoginStep2 } from "../components/LoginStep2";

export const Login = () => {
    const { stage } = useLogin();
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
            {stage == 1 && <LoginStep1 />}
            {stage == 2 && <LoginStep2 />}
        </main>
    );
};
