import React, { useState } from "react";
import { useTranslation } from "@/context/TranslationContext";
import SettingsModal from "@/components/SettingsModal";
import StarsBackground from "@/animation/StarsBackground";
import SignInModal from "@/components/Auth/SignInModal";
import SignUpModal from "@/components/Auth/SignUpModal";


const Accueil: React.FC = () => {
    const { t } = useTranslation();
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);


    const closeModal = (modal: "signIn" | "signUp" ) => {
        modal === "signIn" ? setIsSignInOpen(false) : setIsSignUpOpen(false);
    };

    return (
        <div className=" scale-95">
            <div className="crt w-screen h-screen rounded-[150px] overflow-hidden bg-gray-900 flex flex-col">
                <div className="absolute top-20 right-20 z-50 text-white">
                    <SettingsModal />
                </div>

                <div className="w-3/5 mx-auto mt-4 py-3 px-6 bg-gray-800 rounded-[20px] border-2 border-gray-600 shadow-lg text-white text-center">
                    <h1 className="title neonText text-7xl text-blue-100">ft_transcendence</h1>
                </div>

                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                    <div className="w-full h-full absolute top-[-100%] scanline-glow" />
                </div>

                <StarsBackground />

                <div className="flex flex-col items-center justify-center gap-11 min-h-screen relative z-10">
                    <button className="title neon-button px-20 py-10 bg-blue-300 text-black rounded hover:bg-gray-50" onClick={() => setIsSignInOpen(true)}>
                        {t("Se connecter")}
                    </button>
                    <button className="title neon-button px-20 py-10 bg-blue-300 text-black rounded hover:bg-gray-50" onClick={() => setIsSignUpOpen(true)}>
                        {t("Inscription")}
                    </button>
                </div>
                <SignInModal isOpen={isSignInOpen} onClose={() => closeModal("signIn")} />
                <SignUpModal isOpen={isSignUpOpen} onClose={() => closeModal("signUp")} />
            </div>
        </div>
    );
};

export default Accueil;
