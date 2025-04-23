import React, { useState } from "react";
import { useTranslation } from "@/context/TranslationContext";
import { useAuth } from "@/hooks/auth/useAuth";
import { AuthModal } from "../AuthModal";

interface TwoFAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TwoFAModal: React.FC<TwoFAModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [twoFACode, setTwoFACode] = useState("");

  const { verify2FA } = useAuth({
    onSuccess: () => {
        onClose();
    },
  });

  const handleVerify2FA = () => {
    verify2FA(twoFACode);
  };

  return (
    <AuthModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">{t("Authentification à deux facteurs")}</h2>
      <input
        className="w-full px-3 py-2 border rounded mb-4"
        type="text"
        placeholder={t("Code 2FA")}
        value={twoFACode}
        onChange={(e) => setTwoFACode(e.target.value)}
      />
      <button
        className={`px-4 py-2 rounded w-full ${twoFACode ? "bg-blue-300 text-black hover:bg-gray-200" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
        onClick={handleVerify2FA}
        disabled={!twoFACode}
      >
        {t("Vérifier le code")}
      </button>
    </AuthModal>
  );
};

export default TwoFAModal;
