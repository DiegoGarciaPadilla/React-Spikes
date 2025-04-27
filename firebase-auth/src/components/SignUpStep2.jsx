import { useState } from "react";
import { Card } from "./Card";
import { CustomInput } from "./CustomInput";
import { useAuth } from "../hooks/useAuth";
import { useSignUp } from "../hooks/useSignUp";

export const SignUpStep2 = () => {
    const [phoneNumber, setPhoneNumber] = useState("");

    const { error, setError, startEnrollment } = useAuth();
    const { setStage } = useSignUp();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await startEnrollment(phoneNumber);
            setStage(3);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleChange = ({ target: { value } }) => {
        setPhoneNumber(value);
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
            <form action="#" onSubmit={handleSubmit} className="space-y-4">
                <CustomInput
                    label="Teléfono"
                    type="tel"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 mt-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
                >
                    Enviar código
                </button>
            </form>
        </Card>
    );
};
