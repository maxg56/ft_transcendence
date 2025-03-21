import React, { useState, useEffect } from "react";
import { X, Settings } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";

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
    
    const { t, changeLanguage } = useTranslation();
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
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
                        {/* Croix pour fermer */}
                        <button
                            onClick={() => setIsSignInOpen(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                        >
                            <X size={24} />
                        </button>

                        {/* Formulaire */}
                        <h2 className="text-lg font-bold mb-4">Connexion</h2>
                        <input
                            type="text"
                            placeholder="Login"
                            className="w-full px-3 py-2 border rounded mb-4"
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            className="w-full px-3 py-2 border rounded mb-4"
                        />
                        <button
                            className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200 w-full"
                            onClick={() => setIsSignInOpen(false)}
                        >
                            {t ('Se connecter')}
                        </button>
                    </div>
                </div>
            )}

            {/* Modale Sign Up */}
            {isSignUpOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
                        {/* Croix pour fermer */}
                        <button
                            onClick={() => setIsSignUpOpen(false)}
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
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full px-3 py-2 border rounded mb-4"
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            className="w-full px-3 py-2 border rounded mb-4"
                        />
                        <input
                            type="password"
                            placeholder="Confirmer le mot de passe"
                            className="w-full px-3 py-2 border rounded mb-4"
                        />
                        <button
                            className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200 w-full"
                            onClick={() => setIsSignUpOpen(false)}
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
                            Choisir langue</button>

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
