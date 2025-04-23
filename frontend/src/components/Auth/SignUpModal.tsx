import React, { useState } from "react";
import { useTranslation } from "@/context/TranslationContext";
import { useAuth } from "@/hooks/auth/useAuth";
import { AuthModal } from "../AuthModal";
import PasswordStrengthBar from "./PasswordStrengthBar";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [username, setUsername] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { signUp } = useAuth({
      onSuccess: () => {
          onClose();  // Close the modal on successful sign up
      },
    });

    const handleSignUp = () => {
      signUp(username, mail, password, confirmPassword);
    };

    return (
    <AuthModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">{t("Inscription")}</h2>
      <input
        className="w-full px-3 py-2 border rounded mb-4"
        type="text"
        placeholder={t("Nom d'utilisateur")}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="w-full px-3 py-2 border rounded mb-4"
        type="email"
        placeholder={t("Email")}
        value={mail}
        onChange={(e) => setMail(e.target.value)}
      />
      <PasswordStrengthBar password={password} />
      <input
        className="w-full px-3 py-2 border rounded mb-4"
        type="password"
        placeholder={t("Mot de passe")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="w-full px-3 py-2 border rounded mb-4"
        type="password"
        placeholder={t("Confirmer le mot de passe")}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button
        className={`px-4 py-2 rounded w-full ${username && mail && password && confirmPassword ? "bg-blue-300 text-black hover:bg-gray-200" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
        onClick={handleSignUp}
        disabled={!username || !mail || !password || !confirmPassword}
      >
        {t("Inscription")}
      </button>
    </AuthModal>
  );
};

export default SignUpModal;
