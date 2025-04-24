import React, { useState, useEffect } from "react";
import { useTranslation } from "@/context/TranslationContext";
import { useAuth } from "@/hooks/auth/useAuth";
import { AuthModal } from "../AuthModal";
import PasswordInput from "./PasswordInput";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { signIn } = useAuth({
    onSuccess: () => {
      onClose();
    },
    onError: (err) => {
      setError(err);
    },
  });

  // Reset form fields when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setLogin("");
      setPassword("");
      setError(null);
    }
  }, [isOpen]);

  const handleSignIn = () => {
    if (login && password) {
      signIn(login, password);
    }
  };

  return (
    <AuthModal isOpen={isOpen} onClose={onClose}>
        <h2 className="text-2xl font-bold mb-4 text-center">{t("Connexion")}</h2>

        {error && (
            <div className="border border-red-500 bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
                {t(error)}
            </div>
        )}
      <input
        aria-label={t("Nom d'utilisateur")}
        className={`w-full px-3 py-2 border rounded mb-4 ${error != null   ? "border-red-500" : ""}`}
        type="text"
        placeholder={t("Nom d'utilisateur")}
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />

      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        name={t("Mot de passe")}
      />

      <button
        aria-label={t("Se connecter")}
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
