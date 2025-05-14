import React, { useState } from "react";
import { useTranslation } from "@/context/TranslationContext";
import { useAuth } from "@/hooks/auth/useAuth";
import { AuthModal } from "../AuthModal";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

interface TwoFAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TwoFAModal: React.FC<TwoFAModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [twoFACode, setTwoFACode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { verify2FA } = useAuth({
    onSuccess: () => {
        onClose();
    },
    onError: () => {
      setError(t("Code 2FA invalide"));
    },
  });
  const handleVerify2FA = () => {
    verify2FA(twoFACode);
  };

  return (
    <AuthModal isOpen={isOpen} onClose={onClose} className=" max-2  md:mx-auto ">
      <h2 className="px-2 py-2 rounded w-full  text-center">{t("code 2FA")}</h2>
      {error && (
          <div className="border border-red-500 bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}
      <InputOTP 
      maxLength={6} 
      value={twoFACode} 
      onChange={setTwoFACode}
      containerClassName="px-2 py-2 rounded  mb-3 flex justify-center"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator/>
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <button
        type="button"
        aria-label={t("Vérifier le code")}
        className={`px-5 py-5 rounded text-center text-lg font-semibold mb-4 transition duration-20 ease-in-out 
          w-75  ${
          twoFACode.length === 6 
          ? "bg-blue-300 text-black rounded hover:bg-gray-50"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
        onClick={handleVerify2FA}
        disabled={twoFACode.length !== 6}
      >
        {t("Vérifier le code")}
      </button>

    </AuthModal>
  );
};

export default TwoFAModal;
