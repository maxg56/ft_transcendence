import React, { useState } from "react";
import { useTranslation } from "@/context/TranslationContext";
import { useAuth } from "@/hooks/auth/useAuth";
import { AuthModal } from "../AuthModal";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useAuth({
    onSuccess: () => {
        onClose();
    },
  });

  const handleSignIn = () => {
    signIn(login, password);
  };

  return (
    <AuthModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">{t("Connexion")}</h2>
      <input
        className="w-full px-3 py-2 border rounded mb-4"
        type="text"
        placeholder={t("Nom d'utilisateur")}
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <input
        className="w-full px-3 py-2 border rounded mb-4"
        type="password"
        placeholder={t("Mot de passe")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className={`px-4 py-2 rounded w-full ${login && password ? "bg-blue-300 text-black hover:bg-gray-200" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
        onClick={handleSignIn}
        disabled={!login || !password}
      >
        {t("Se connecter")}
      </button>
    </AuthModal>
  );
};

export default SignInModal;
