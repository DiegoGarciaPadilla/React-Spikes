import { useState } from "react";
import { Card } from "./Card";
import { CustomInput } from "./CustomInput";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

export const SignUpCard = ({ setStage }) => {
    const [user, setUser] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState(null);

    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleChange = ({ target: { name, value } }) => {
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (user.password !== user.confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        signUp(user.email, user.password)
            .then(() => {
                alert("Usuario registrado con éxito");
                setStage(1);
            })
            .catch((error) => {
                console.error("Error al registrar el usuario: ", error);
                setError(error.message);
            });
    };

    const handleClick = () => {
        navigate("/login");
    };

    return (
        <Card>
            <h1 className="text-3xl md:text-4xl font-medium text-center mb-8 ">
                Regístrate
            </h1>
            {error && (
                <div className="bg-red-500 text-white p-4 rounded-md mb-4">
                    {error}
                </div>
            )}
            <div className="space-y-4">
                <form action="#" onSubmit={handleSubmit} className="space-y-4">
                    <CustomInput
                        label="Correo electrónico"
                        type="email"
                        name="email"
                        id="email"
                        onChange={handleChange}
                    />
                    <CustomInput
                        label="Contraseña"
                        type="password"
                        name="password"
                        id="password"
                        onChange={handleChange}
                    />
                    <CustomInput
                        label="Confirmar contraseña"
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        onChange={handleChange}
                    />
                    <span
                        className="text-center cursor-pointer hover:text-gray-300"
                        onClick={handleClick}
                    >
                        ¿Ya tienes una cuenta?
                    </span>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 mt-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Regístrate
                    </button>
                </form>
            </div>
        </Card>
    );
};
