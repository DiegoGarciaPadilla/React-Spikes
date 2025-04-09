import { useSignUp } from "../context/SignUpContext";
import { SignUpCard } from "../components/SignUpCard";
import { SignUpGenTOTPCard } from "../components/SignUpGenTOTPCard";

export const SignUp = () => {

    const { stage, setStage } = useSignUp();

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
            {stage == 0 && <SignUpCard setStage={setStage} />}
            {stage == 1 && <SignUpGenTOTPCard setStage={setStage} />}
        </main>
    );
};
