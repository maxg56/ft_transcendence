import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/context/TranslationContext";
import { useAuth } from "@/hooks/auth/useAuth";
import { AuthModal } from "../AuthModal";
import PasswordStrengthBar from "./PasswordStrengthBar";
import PasswordInput from "./PasswordInput";

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
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  const { signUp } = useAuth({
    onSuccess: () => {
      handleClose();
    },
    onError: (err) => {
      setError(err);
      setShake(true);
      setTimeout(() => setShake(false), 500); // durée de l’animation
    },
  });

  const handleSignUp = () => {
    if (!username || !mail || !password || !confirmPassword) {
      setError(t("Tous les champs sont requis."));
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setError(null);
    signUp(username, mail, password, confirmPassword);
  };

  const handleClose = () => {
    setUsername("");
    setMail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      handleClose();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSignUp();
    }
  };

  return (
    <AuthModal isOpen={isOpen} onClose={handleClose}>
      <div
        ref={formRef}
        onKeyDown={handleKeyDown}
        className={`${shake ? "animate-shake" : ""}`}
      >
        <h2 className="px-2 py-2 rounded w-full  text-center">
          {t("Inscription")}
        </h2>

        {error && (
          <div className="border border-red-500 bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

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
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name={t("Mot de passe")}
        />
        <PasswordInput
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t("Confirmer le mot de passe")}
        />
        <button
          className={`px-4 py-2 rounded w-full ${
            username && mail && password && confirmPassword
              ? "bg-blue-300 text-black hover:bg-gray-200"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={handleSignUp}
          disabled={!username || !mail || !password || !confirmPassword}
        >
          {t("Inscription")}
        </button>
      </div>
    </AuthModal>
  );
};

export default SignUpModal;
