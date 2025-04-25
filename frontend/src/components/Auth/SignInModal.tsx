import React, { useState, useEffect } from "react";
import { useTranslation } from "@/context/TranslationContext";
import { useAuth } from "@/hooks/auth/useAuth";
import { AuthModal } from "../AuthModal";
import PasswordInput from "./PasswordInput";
import TwoFAModal from "./TwoFAModal";
interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const {
    signIn,
    needs2FA,
    cancel2FA
  } = useAuth({
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
    <>
    <AuthModal isOpen={isOpen} onClose={onClose}>
        <h2 className="`px-2 py-2 rounded w-full  text-center">{t("Se connecter")}</h2>

        {error && (
            <div className="border border-red-500 bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
                {t(error)}
            </div>
        )}
      <input
        aria-label={t("Nom d'utilisateur")}
        className={`w-full px-3 py-2 border rounded mb-4`}
        type="text"
        placeholder={t("Nom d'utilisateur")}
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />

      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t("Mot de passe")}
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
    <TwoFAModal
        isOpen={needs2FA}
        onClose={cancel2FA}
      />
    </>
  );
};

export default SignInModal;
