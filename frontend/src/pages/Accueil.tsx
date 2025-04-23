import React, { useState, useEffect } from "react";
import { X, Settings } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import useNavigation from "../hooks/useNavigation";
import SettingsModal from "../components/SettingsModal";
import StarsBackground from "../animation/StarsBackground";


const Accueil: React.FC = () => {
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);

    // Gestion de la langue
    const { t } = useTranslation();

    // Navigation
    const { navigate } = useNavigation();

    // État des formulaires
    const [login, setLogin] = useState("");
    const [passwordSignIn, setPasswordSignIn] = useState("");
    const [username, setUsername] = useState("");
    const [mail, setMail] = useState("");
    const [passwordSignUp, setPasswordSignUp] = useState("");
    const [confirmPassword, setConfirmPass] = useState("");

    // Réinitialisation des champs
    const resetModals = () => {
        setLogin("");
        setPasswordSignIn("");
        setUsername("");
        setMail("");
        setPasswordSignUp("");
        setConfirmPass("");
    };

    // Fermeture des modales
    const closeModal = (modalType: string) => {
        if (modalType === "signIn") setIsSignInOpen(false);
        if (modalType === "signUp") setIsSignUpOpen(false);
        resetModals();
    };

    // Connexion
    const handleSignIn = async () => {
        if (!login || !passwordSignIn) {
            console.error("Veuillez remplir tous les champs.");
            return;
        }
        console.log(`Connexion avec ${login}`);
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username :login,
                password: passwordSignIn,
            }),
        };

        try {
            const response = await fetch("https://localhost:8443/auth/login", requestOptions);
            if (!response.ok) throw new Error(`Erreur ${response.status}: ${await response.text()}`);

            console.log("Inscription réussie");
            closeModal("signUp");
            navigate("/hub");
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error);
        }
    };

    // Inscription
    const handleSignUp = async () => {
        if (!username || !mail || !passwordSignUp || !confirmPassword) {
            console.error("Tous les champs doivent être remplis");
            return;
        }
        if (passwordSignUp !== confirmPassword) {
            console.error("Les mots de passe ne correspondent pas");
            return;
        }

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                email: mail,
                password: passwordSignUp,
            }),
        };

        try {
            const response = await fetch("https://localhost:8443/auth/register", requestOptions);
            if (!response.ok) throw new Error(`Erreur ${response.status}: ${await response.text()}`);

            console.log("Inscription réussie");
            closeModal("signUp");
            navigate("/hub");
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error);
        }
    };

    return (
        <div className="scale-95">
        <div>
        <div className="crt w-screen h-screen rounded-[150px] padding-[10px] overflow-hidden bg-gray-900 flex flex-col">
        <div className="absolute top-20 right-20 z-50 text-white">
            <SettingsModal />
        </div>
        <div className="w-3/5 mx-auto mt-4 py-3 px-6 bg-gray-800 rounded-[20px] border-2 border-gray-600 shadow-lg text-white">
        <div className="relative text-center">
         {/* Centered Title */}
        <h1 className="neonText text-7xl text-blue-100">ft_transcendence</h1>
        </div>
        </div>
        {/* CRT Scanline Sweep */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
         <div className="w-full h-full absolute top-[-100%] scanline-glow" />
        </div>
            <StarsBackground />
            {/* Body avec les boutons */}
            <div className=" flex flex-col items-center justify-center gap-11 min-h-screen relative z-10">
                {/* Bouton Sign In */}
                <button
                    className="neon-button px-20 py-10 bg-blue-300 text-black rounded hover:bg-gray-50"
                    onClick={() => setIsSignInOpen(true)} >
                    {t ('Se connecter')}
                </button>

                {/* Bouton Sign Up */}
                <button
                    className="neon-button px-20 py-10 bg-blue-300 text-black rounded hover:bg-gray-50"
                    onClick={() => setIsSignUpOpen(true)} >
                    {t ('Inscription')}
                </button>
            </div>

            {/* Modale Sign In */}
            {isSignInOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={() => closeModal("signIn")}>
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative"
                        onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => closeModal("signIn")} className="absolute top-2 right-2 text-gray-600 hover:text-red-500">
                            <X size={24} />
                        </button>

                        <h2 className="text-lg font-bold mb-4">Connexion</h2>
                        <input type="text" placeholder={t("Nom d'utilisateur")} className="w-full px-3 py-2 border rounded mb-4"
                            value={login} onChange={(e) => setLogin(e.target.value)} />
                        <input type="password" placeholder={t("Mot de passe")} className="w-full px-3 py-2 border rounded mb-4"
                            value={passwordSignIn} onChange={(e) => setPasswordSignIn(e.target.value)} />
                        <button className={`px-4 py-2 rounded w-full ${login && passwordSignIn ? "bg-blue-300 text-black hover:bg-gray-200" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                            onClick={handleSignIn} disabled={!login || !passwordSignIn}>
                            {t("Se connecter")}
                        </button>
                    
                    </div>
                
                </div>
            )}

            {/* Modale Sign Up */}
            {isSignUpOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={() => closeModal("signUp")}>
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative"
                        onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => closeModal("signUp")} className="absolute top-2 right-2 text-gray-600 hover:text-red-500">
                            <X size={24} />
                        </button>

                        <h2 className="text-lg font-bold mb-4">{t("Inscription")}</h2>
                        <input type="text" placeholder="Nom d'utilisateur" className="w-full px-3 py-2 border rounded mb-4"
                            value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="email" placeholder="Email" className="w-full px-3 py-2 border rounded mb-4"
                            value={mail} onChange={(e) => setMail(e.target.value)} />
                        <input type="password" placeholder="Mot de passe" className="w-full px-3 py-2 border rounded mb-4"
                            value={passwordSignUp} onChange={(e) => setPasswordSignUp(e.target.value)} />
                        <input type="password" placeholder="Confirmer le mot de passe" className="w-full px-3 py-2 border rounded mb-4"
                            value={confirmPassword} onChange={(e) => setConfirmPass(e.target.value)} />
                        <button className={`px-4 py-2 rounded w-full ${username && mail && passwordSignUp && confirmPassword ? "bg-blue-300 text-black hover:bg-gray-200" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                            onClick={handleSignUp} disabled={!username || !mail || !passwordSignUp || !confirmPassword}>
                            {t("Inscription")}
                        </button>
                    </div>
                </div>
            )}
        </div>
        </div>
        </div>
    );
};

export default Accueil;