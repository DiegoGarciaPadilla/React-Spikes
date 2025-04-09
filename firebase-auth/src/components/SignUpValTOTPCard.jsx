import { useState } from "react";
import { Card } from "./Card";
import { CustomInput } from "./CustomInput";
import { useAuth } from "../context/AuthContext";
import { useSignUp } from "../context/SignUpContext";
import { ResetApp } from "./ResetApp";
import { useNavigate } from "react-router";

export const SignUpValTOTPCard = () => {
    const [currentCode, setCurrentCode] = useState("");
    const [error, setError] = useState(null);

    const { totpSecret, verifyToken } = useAuth();
    const { setStage } = useSignUp();
    
    const navigate = useNavigate();

    const handleChange = ({ target: { value } }) => {
        setCurrentCode(value);
    };

    const handleClick = () => {
        if (currentCode.length !== 6) {
            alert("El código debe tener 6 dígitos");
            return;
        }
        const verify = verifyToken(currentCode, totpSecret.base32)
        if (verify) {
            alert("Código verificado con éxito. Bienvenido!");
            setStage(0);
            navigate("/login");
        } else {
            setError("Código incorrecto");
        }
    };

    const handleBack = () => {
        setStage(1);
    }

    return (
        <Card>
            <h1 className="text-3xl md:text-4xl font-medium text-center mb-8 ">
                Valida tu código
            </h1>
            {error && (
                <div className="bg-red-500 text-white p-4 rounded-md mb-4">
                    {error}
                </div>
            )}
            <CustomInput
                label="Código de 6 dígitos"
                type="number"
                name="number"
                id="totp"
                onChange={handleChange}
            />
            <span
                className="text-center cursor-pointer hover:text-gray-300"
                onClick={handleBack}
            >
                Regresar
            </span>
            <button
                onClick={handleClick}
                className="w-full bg-blue-600 mt-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
            >
                Validar TOTP
            </button>
            <ResetApp />
        </Card>
    );
};
