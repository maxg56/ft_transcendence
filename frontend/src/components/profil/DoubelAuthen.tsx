import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { DoubleAuthentificationModal } from "@/components/profil/DoubleAuthenModal"
export function DoubleAuthentification() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false) // État pour gérer si le switch est activé ou non

  // Fonction pour gérer l'ouverture de la modale
  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  // Fonction pour gérer la fermeture de la modale
  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  // Données exemple (QR code et clé secrète)
  const qrCode = "data:image/png;base64,..."; // Remplace par le QR code venant de ton API
  const secretKey = "JBSWY3DPEHPK3PXP" // Remplace par la clé secrète venant de ton API

  // Fonction pour activer l'authentification
  const handleActivate = () => {
    setIsEnabled(true)
    handleModalClose()
    console.log("2FA activée")
  }

  // Fonction pour annuler et remettre à false
  const handleCancel = () => {
    setIsEnabled(false)
    handleModalClose()
  }

  return (
    <div>
      <div className="flex items-center space-x-2">
        <Switch
          id="authentification"
          checked={isEnabled} // L'état du switch dépend de `isEnabled`
          onClick={handleModalOpen} // Ouvre la modale quand on clique sur le switch
        />
        <Label className="text-size-[50px]" htmlFor="authentification">Activer Authentification</Label>
      </div>

      {/* Appel de la modale */}
      <DoubleAuthentificationModal
        open={isModalOpen}
        onClose={handleModalClose}
        qrCode={qrCode}
        secretKey={secretKey}
        onActivate={handleActivate} // Passe handleActivate pour activer la 2FA
        onCancel={handleCancel} // Passe handleCancel pour annuler
      />
    </div>
  )
}
