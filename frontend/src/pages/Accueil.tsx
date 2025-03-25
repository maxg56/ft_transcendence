import React, { useState, useEffect } from "react";
import { X, Settings } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import  useNavigation  from "../hooks/useNavigation";


const Accueil: React.FC = () => {
   
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [isParamOpen, setParamOpen] = useState(false);
    const [showLangOptions, setShowLangOptions] = useState(false);

    useEffect(() => {
        if (isParamOpen) {
            setShowLangOptions(false);
        }
    }, [isParamOpen]);
    
    //pour changer la langue
    const { t, changeLanguage } = useTranslation();

    //naviguation    
    const { navigate } = useNavigation();

    // Variable pour stocker login et mdp   
    const [login, setLogin] = useState("");
    const [passwordSignIn, setPasswordSignIn] = useState("");

    // Variable pour Sign Up
    const [username, setUsername] = useState("");
    const [mail, setMail] = useState("");
    const [passwordSignUp, setPasswordSignUp] = useState("");
    const [confirmPassword, setConfirmPass] = useState("");

    // Fonction pour réinitialiser les valeurs des formulaires
    const resetModals = () => {
        setLogin("");
        setPasswordSignIn("");
        setUsername("");
        setMail("");
        setPasswordSignUp("");
        setConfirmPass("");
    }

    // Fonction pour fermer les modales et réinitialiser les champs
    const closeModal = (modalType: string) => {
        if (modalType === "signIn") {
            setIsSignInOpen(false);
        } else if (modalType === "signUp") {
            setIsSignUpOpen(false);
        } else if (modalType === "param") {
            setParamOpen(false);
        }
        resetModals(); // Réinitialisation des champs à la fermeture de la modale
    }

    return (
        <div>
            {/* Header Titre avec Param bouton*/}
            <header className="bg-orange-300 p-4 text-white flex justify-center items-center relative">
                FT_TRANSCENDENCE
                <button
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white hover:text-gray-200"
                    onClick={() => setParamOpen(true)}
                >
                    <Settings size={32} />
                </button>
            </header>

            {/* Body avec les boutons */}
            <div className="flex flex-col items-center gap-4 mt-4">
                {/* Bouton Sign In */}
                <button
                    className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200"
                    onClick={() => setIsSignInOpen(true)} >
                    {t ('Se connecter')}
                </button>

                {/* Bouton Sign Up */}
                <button
                    className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200"
                    onClick={() => setIsSignUpOpen(true)} >
                    {t ('Inscription')}
                </button>

            </div>

            {/* Modale Sign In */}
            {isSignInOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                        onClick={() => closeModal("signIn")}>
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative"
                        onClick={(e) => e.stopPropagation()}>
                        {/* Croix pour fermer */}
                        <button
                            onClick={() => closeModal("signIn")}
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                        >
                            <X size={24} />
                        </button>

                        {/* Formulaire */}
                        <h2 className="text-lg font-bold mb-4">Connexion</h2>
                        <input
                            type="text"
                            placeholder={t("Nom d'utilisateur")}
                            className="w-full px-3 py-2 border rounded mb-4"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder={t("Mot de passe")}
                            className="w-full px-3 py-2 border rounded mb-4"
                            value={passwordSignIn}
                            onChange={(e) => setPasswordSignIn(e.target.value)}
                        />
                        <button
                            className={`px-4 py-2 rounded w-full ${login && passwordSignIn ? "bg-orange-300 text-black hover:bg-gray-200" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                            onClick={() => {
                                closeModal("signIn") // 🔥 Fermer la modale
                                setTimeout(() => navigate("/hub"), 50)}} // 🔥 Petit delai pour laisser le temps à React de re-render
                                disabled={!login || !passwordSignIn}
                        >
                            {t ('Se connecter')}
                        </button>
                    </div>
                </div>
            )}

            {/* Modale Sign Up */}
            {isSignUpOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                        onClick={() => closeModal("signIn")}>
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative"
                            onClick={(e) => e.stopPropagation()}>
                        {/* Croix pour fermer */}
                        <button
                            onClick={() => closeModal("signUp")}
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                        >
                            <X size={24} />
                        </button>

                        {/* Formulaire */}
                        <h2 className="text-lg font-bold mb-4">{t('Inscription')}</h2>
                        <input
                            type="text"
                            placeholder="Nom d'utilisateur"
                            className="w-full px-3 py-2 border rounded mb-4"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full px-3 py-2 border rounded mb-4"
                            value={mail}
                            onChange={(e) => setMail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            className="w-full px-3 py-2 border rounded mb-4"
                            value={passwordSignUp}
                            onChange={(e) => setPasswordSignUp(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirmer le mot de passe"
                            className="w-full px-3 py-2 border rounded mb-4"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPass(e.target.value)}
                        />
                        <button
                            className={`px-4 py-2 rounded w-full ${username && mail && passwordSignUp && confirmPassword ? "bg-orange-300 text-black hover:bg-gray-200" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                            onClick={() => {
                                closeModal("signUp")
                                setTimeout(() => navigate("/hub"), 50)}}
                                disabled={!username || !mail || !passwordSignUp || !confirmPassword}
                                >
                            {t ('Inscription')}
                        </button>
                    </div>
                </div>
            )}

            {/* Modale Parametres */}
            {isParamOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
                        <button
                        onClick={() => setParamOpen(false)}
                        className="absolute top-2 right-2 text-gray-600 hover:text-red-500">
                            <X size={24} />
                        </button>
                        <h2 className="text-lg font-bold mb-4">{t('Parametres')} </h2>
                        {!showLangOptions ? (
                            <button className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200" 
                            onClick={() => setShowLangOptions(true) }>
                            {t('Choisir langue')}</button>

                        ): (
                        <div className="flex flex-col gap-2">
                            <button className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200"
                                onClick={() => changeLanguage("en") }>
                                    English
                            </button>
                            <button className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200"
                                onClick={() => changeLanguage("fr")}>
                                    Français
                            </button>
                        </div>
                )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accueil;
