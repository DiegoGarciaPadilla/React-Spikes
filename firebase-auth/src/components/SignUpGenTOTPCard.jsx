import { useEffect, useState } from "react";
import { Card } from "./Card";
import { useAuth } from "../hooks/useAuth";
import { useSignUp } from "../hooks/useSignUp";
import QRCode from "qrcode";

export const SignUpGenTOTPCard = () => {
    const [qrCode, setQrCode] = useState(null);
    const { totpSecret, setTotpSecret, generateSecret } = useAuth();
    const { setStage } = useSignUp();

    useEffect(() => {
        if (totpSecret) {
            QRCode.toDataURL(totpSecret.otpauth_url, {
                errorCorrectionLevel: "H",
            })
                .then((url) => {
                    setQrCode(url);
                    console.log("TOTP Secret:", totpSecret);
                })
                .catch((err) => {
                    console.error("Error generating QR code: ", err);
                });
        } else {
            console.log("No TOTP secret found, generating a new one...");
            const secret = generateSecret();
            setTotpSecret(secret);
            QRCode.toDataURL(secret.otpauth_url, { errorCorrectionLevel: "H" })
                .then((url) => {
                    setQrCode(url);
                    console.log("TOTP Secret:", secret);
                })
                .catch((err) => {
                    console.error("Error generating QR code: ", err);
                });
        }
    }, []);

    const handleClick = () => {
        setStage(2);
    }

    return (
        <Card>
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
