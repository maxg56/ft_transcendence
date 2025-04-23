import React, { useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import useNavigation from "../hooks/useNavigation";
import SettingsModal from "../components/SettingsModal";
import StarsBackground from "../animation/StarsBackground";
import {useAuth} from "../hooks/auth/useAuth";
import PasswordStrengthBar from "../components/Auth/PasswordStrengthBar";





const AuthModal = ({
    isOpen,
    onClose,
    children,
}: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) =>
    isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-red-500">
                    <X size={24} />
                </button>
                {children}
            </div>
        </div>
    ) : null;

const Accueil: React.FC = () => {
    const { t } = useTranslation();
    const { navigate } = useNavigation();

    const { signIn, signUp ,verify2FA} = useAuth({
        onSuccess: () => {
          resetModals();
          navigate("/hub");
        },
      });

    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [is2FARequired, setIs2FARequired] = useState(false);
    const [twoFACode, setTwoFACode] = useState("");


    const [login, setLogin] = useState("");
    const [passwordSignIn, setPasswordSignIn] = useState("");
    const [username, setUsername] = useState("");
    const [mail, setMail] = useState("");
    const [passwordSignUp, setPasswordSignUp] = useState("");
    const [confirmPassword, setConfirmPass] = useState("");

    const resetModals = () => {
        setLogin("");
        setPasswordSignIn("");
        setUsername("");
        setMail("");
        setPasswordSignUp("");
        setConfirmPass("");
    };

    const closeModal = (modal: "signIn" | "signUp") => {
        modal === "signIn" ? setIsSignInOpen(false) : setIsSignUpOpen(false);
        resetModals();
    };

    return (
        <div className="scale-95">
            <div className="crt w-screen h-screen rounded-[150px] overflow-hidden bg-gray-900 flex flex-col">
                <div className="absolute top-20 right-20 z-50 text-white">
                    <SettingsModal />
                </div>

                <div className="w-3/5 mx-auto mt-4 py-3 px-6 bg-gray-800 rounded-[20px] border-2 border-gray-600 shadow-lg text-white text-center">
                    <h1 className="neonText text-7xl text-blue-100">ft_transcendence</h1>
                </div>

                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                    <div className="w-full h-full absolute top-[-100%] scanline-glow" />
                </div>

                <StarsBackground />

                <div className="flex flex-col items-center justify-center gap-11 min-h-screen relative z-10">
                    <button className="neon-button px-20 py-10 bg-blue-300 text-black rounded hover:bg-gray-50" onClick={() => setIsSignInOpen(true)}>
                        {t("Se connecter")}
                    </button>
                    <button className="neon-button px-20 py-10 bg-blue-300 text-black rounded hover:bg-gray-50" onClick={() => setIsSignUpOpen(true)}>
                        {t("Inscription")}
                    </button>
                </div>

                {/* Sign In Modal */}
                <AuthModal isOpen={isSignInOpen} onClose={() => closeModal("signIn")}>
                    <h2 className="text-lg font-bold mb-4">Connexion</h2>
                    <input className="w-full px-3 py-2 border rounded mb-4" type="text" placeholder={t("Nom d'utilisateur")} value={login} onChange={(e) => setLogin(e.target.value)} />
                    <input className="w-full px-3 py-2 border rounded mb-4" type="password" placeholder={t("Mot de passe")} value={passwordSignIn} onChange={(e) => setPasswordSignIn(e.target.value)} />
                    <button
                        className={`px-4 py-2 rounded w-full ${login && passwordSignIn ? "bg-blue-300 text-black hover:bg-gray-200" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                        onClick={() => signIn(login, passwordSignIn)}
                        disabled={!login || !passwordSignIn}
                    >
                        {t("Se connecter")}
                    </button>
                </AuthModal>

                {/* Sign Up Modal */}
                <AuthModal isOpen={isSignUpOpen} onClose={() => closeModal("signUp")}>
                    <h2 className="text-lg font-bold mb-4">{t("Inscription")}</h2>
                    <input className="w-full px-3 py-2 border rounded mb-4" type="text" placeholder={t("Nom d'utilisateur")} value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input className="w-full px-3 py-2 border rounded mb-4" type="email" placeholder={t("Email")} value={mail} onChange={(e) => setMail(e.target.value)} />
                    <PasswordStrengthBar password={passwordSignUp} />
                    <input className="w-full px-3 py-2 border rounded mb-4" type="password" placeholder={t("Mot de passe")} value={passwordSignUp} onChange={(e) => setPasswordSignUp(e.target.value)} />
                    <input className="w-full px-3 py-2 border rounded mb-4" type="password" placeholder={t("Confirmer le mot de passe")} value={confirmPassword} onChange={(e) => setConfirmPass(e.target.value)} />
                    <button
                        className={`px-4 py-2 rounded w-full ${username && mail && passwordSignUp && confirmPassword ? "bg-blue-300 text-black hover:bg-gray-200" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                        onClick={() => signUp(username, mail, passwordSignUp, confirmPassword)}
                        disabled={!username || !mail || !passwordSignUp || !confirmPassword}
                    >
                        {t("Inscription")}
                    </button>
                </AuthModal>
                <AuthModal isOpen={is2FARequired} onClose={() => setIs2FARequired(false)}>
                    <h2 className="text-lg font-bold mb-4">{t("Authentification à deux facteurs")}</h2>
                    <input
                      className="w-full px-3 py-2 border rounded mb-4"
                      type="text"
                      placeholder={t("Code 2FA")}
                      value={twoFACode}
                      onChange={(e) => setTwoFACode(e.target.value)}
                    />
                    <button
                      className={`px-4 py-2 rounded w-full ${twoFACode ? "bg-blue-300 text-black hover:bg-gray-200" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                      onClick={() => verify2FA(twoFACode)}
                      disabled={!twoFACode}
                    >
                      {t("Vérifier le code")}
                    </button>
                </AuthModal>
            </div>
        </div>
    );
};

export default Accueil;
