import { useState } from "react";
import { Card } from "./Card";
import { CustomInput } from "./CustomInput";
import { useAuth } from "../hooks/useAuth";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router";

export const LoginStep2 = () => {
    const [code, setCode] = useState("");

    const { error, setError, verifyLoginWithSmsCode } = useAuth();
    const { setStage } = useLogin();

    const navigate = useNavigate();

    const handleChange = ({ target: { value } }) => {
        setCode(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (code.length !== 6) {
            alert("El código debe tener 6 dígitos");
            return;
        }
        try {
            await verifyLoginWithSmsCode(code);
            alert("Código verificado con éxito. Bienvenido!");
            setStage(1);
            navigate("/");
        } catch (err) {
            console.error("Error en verificación:", err);
            setError(`Error al verificar el código: ${err.message}`);
        }
    };

    return (
        <Card>
            {error && (
                <div className="bg-red-500 text-white p-4 rounded-md mb-4">
                    {error}
                </div>
            )}
            <h1 className="text-3xl md:text-4xl font-medium text-center mb-8 ">
                Verifica tu cuenta con tu teléfono
            </h1>
            <p className="text-center mb-4">
                Recibiras un número de 6 dígitos en tu teléfono.
            </p>
            <form action="#" onSubmit={handleSubmit}>
                <CustomInput
                    label="Código de 6 dígitos"
                    type="number"
                    name="number"
                    id="code"
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 mt-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
                >
                    Validar código
                </button>
            </form>
        </Card>
    );
};
