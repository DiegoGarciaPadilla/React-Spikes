import { useSignUp } from "../hooks/useSignUp";
import { SignUpStep1 } from "../components/SignUpStep1";
import { SignUpStep2 } from "../components/SignUpStep2";
import { SignUpStep3 } from "../components/SignUpStep3";

export const SignUp = () => {

    const { stage } = useSignUp();

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
            {stage == 1 && <SignUpStep1 />}
            {stage == 2 && <SignUpStep2 />}
            {stage == 3 && <SignUpStep3 />}
        </main>
    );
};
