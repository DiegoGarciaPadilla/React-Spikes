import { useEffect, useState } from "react";
import { Card } from "./Card";
import { useAuth } from "../hooks/useAuth";
import { useSignUp } from "../hooks/useSignUp";
import QRCode from "qrcode";

export const SignUpStep2 = () => {
    const [qrCode, setQrCode] = useState(null);
    const { error, setError, totpSecret, setTotpSecret, generateSecret } =
        useAuth();
    const { setStage } = useSignUp();

    useEffect(() => {
        const generateQRCode = async () => {
            setError(null);
            try {
                if (totpSecret) {
                    const url = await QRCode.toDataURL(totpSecret.otpauth_url, {
                        errorCorrectionLevel: "H",
                    });
                    setQrCode(url);
                } else {
                    const secret = generateSecret();
                    setTotpSecret(secret);
                    const url = await QRCode.toDataURL(secret.otpauth_url, {
                        errorCorrectionLevel: "H",
                    });
                    setQrCode(url);
                }
            } catch (error) {
                console.error("Error generating QR code: ", error);
                setError("Error generating QR code: " + error.message);
            }
        };

        generateQRCode();
    }, []);

    const handleClick = () => {
        setStage(3);
    };

    return (
        <Card>
            {error && (
                <div className="bg-red-500 text-white p-4 rounded-md mb-4">
                    {error}
                </div>
            )}
            <h1 className="text-3xl md:text-4xl font-medium text-center mb-8 ">
                Usa TOTP para proteger tu cuenta
            </h1>
            <img src={qrCode} alt="QR Code" className="mx-auto mb-4" />
            <button
                onClick={handleClick}
                className="w-full bg-blue-600 mt-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
            >
                Validar TOTP
            </button>
        </Card>
    );
};
