import React, { useState, useTransition } from "react";
import { X } from "lucide-react";

const Accueil: React.FC = () => {
   
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [isParamOpen, setParamOpen] = useState(false);

    return (
        <div>
            {/* Header */}
            <header className="bg-orange-500 p-4 text-white flex justify-center items-center">
                FT_TRANSCENDENCE
            </header>

            {/* Body avec les boutons */}
            <div className="flex flex-col items-center gap-4 mt-4">
                {/* Bouton Sign In */}
                <button
                    className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200"
                    onClick={() => setIsSignInOpen(true)}
                >
                    Se connecter
                </button>

                {/* Bouton Sign Up */}
                <button
                    className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200"
                    onClick={() => setIsSignUpOpen(true)}
                >
                    Inscription
                </button>

                {/* Bouton Paramètres */}
                <button className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200"
                    onClick={() => setParamOpen(true)}>
                    Paramètres
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
                            Se connecter
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
                        <h2 className="text-lg font-bold mb-4">Inscription</h2>
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
                            S'inscrire
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
                        <h2 className="text-lg font-bold mb-4">Choisir langue</h2>
                        <div className="flex flex-col gap-2">
                            <button className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200"
                                onClick={() => setParamOpen(false) }>
                                    English
                            </button>
                            <button className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200"
                                onClick={() => setParamOpen(false)}>
                                    Français
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accueil;
