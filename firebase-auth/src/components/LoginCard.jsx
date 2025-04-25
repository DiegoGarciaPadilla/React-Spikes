import { useState } from "react";
import { Card } from "./Card";
import { CustomInput } from "./CustomInput";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

export const LoginCard = () => {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState(null);

    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleChange = ({ target: { name, value } }) => {
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        signIn(user.email, user.password)
            .then(() => {
                alert("Ha iniciado sesión con éxito");
                navigate("/");
            })
            .catch((error) => {
                console.error("Error al iniciar sesión: ", error);
                setError(error.message);
            });
    };

    const handleClickSignUp = () => {
        navigate("/signup");
    };

    const handleGoogleLogin = async () => {
        await signInWithGoogle()
            .then(() => {
                alert("Ha iniciado sesión con éxito");
                navigate("/");
            })
            .catch((error) => {
                console.error("Error al iniciar sesión con Google: ", error);
                setError(error.message);
            });
    };

    return (
        <Card>
            <h1 className="text-3xl md:text-4xl font-medium text-center mb-8 ">
                Iniciar sesión
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
                        required
                        onChange={handleChange}
                    />
                    <CustomInput
                        label="Contraseña"
                        type="password"
                        name="password"
                        id="password"
                        required
                        onChange={handleChange}
                    />
                    <span
                        className="text-center cursor-pointer hover:text-gray-300"
                        onClick={handleClickSignUp}
                    >
                        ¿Aún no tienes una cuenta?
                    </span>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 mt-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
                    >
                        Iniciar sesión
                    </button>
                </form>
                <button
                    onClick={handleGoogleLogin}
                    type="button"
                    className="w-full bg-white py-2 rounded-md hover:bg-gray-100 transition duration-200 text-black flex items-center justify-center cursor-pointer"
                >
                    <img
                        src="https://rotulosmatesanz.com/wp-content/uploads/2017/09/2000px-Google_G_Logo.svg_.png"
                        alt="Google Logo"
                        className="inline-block mr-4"
                        width={22}
                        height={22}
                    />
                    Iniciar sesión con Google
                </button>
            </div>
        </Card>
    );
};
