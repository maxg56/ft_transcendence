import { Dialog } from "@/components/ui/dialog" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/auth/useAuth";
import { useState } from "react"
import { createPortal } from "react-dom"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useTranslation } from "@/context/TranslationContext";

export function DoubleAuthentificationModal({
  open,
  onClose,
  qrCode,
  secretKey,
  onActivate,
  onCancel,
}: {
  open: boolean
  onClose: () => void
  qrCode: string
  secretKey: string
  onActivate: () => void
  onCancel: () => void
}) {
  const { t } = useTranslation();
  const [twoFACode, setTwoFACode] = useState("");
  
  const { verify2FA } = useAuth({
      onSuccess: () => {
        onActivate();
        setTwoFACode("");
      },
      onError: (err) => {
        console.error("Erreur de vérification 2FA :", err);
      },
    });
    const handleVerify2FA = () => {
      verify2FA(twoFACode , false);
    };

  if (!open) return null




  return createPortal(
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">{t("Authentification à deux facteurs")}</h2>
            <div className="mb-4">
              {qrCode ? (
                <img src={qrCode} alt="QR Code pour l'authentification" className="w-40 h-40 mx-auto" />
              ) : null}
            </div>
            <div className="mb-4">
              <Label htmlFor="secretKey">{t("Clé secrète")}</Label>
              <Input
                id="secretKey"
                value={secretKey}
                readOnly
                className="mt-1"
                />
            </div>
            <div className="mb-4">
              <Label htmlFor="authCode">{t("Code d'authentification")}</Label>
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
            </div>
            <div className="flex gap-4 mt-4">
              <Button 
              onClick={handleVerify2FA}
              disabled={twoFACode.length !== 6}
              className="flex-1">{t("Activer")}
              </Button>
            <Button variant="secondary" onClick={onCancel} className="flex-1">{t("Annuler")}</Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>,
    document.body
  )
}
