import { useState } from "react"
import { DoubleAuthentificationModal } from "@/components/profil/DoubleAuthenModal" // La modale que tu as créée
import { ConfirmationModal } from "@/components/profil/DoubleAuthenModalAnnulation" // La nouvelle modale de confirmation

export function DoubleAuthentification() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false) // Gère si le switch est activé ou non
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false) // Gère l'ouverture de la modale de confirmation

  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleActivate = () => {
    setIsEnabled(true)
    handleModalClose()
    console.log("2FA activée")
  }

  const handleCancel = () => {
    setIsEnabled(false)
    handleModalClose()
  }

  const handleDeactivationRequest = () => {
    setIsConfirmationOpen(true)
  }

  const handleDeactivationCancel = () => {
    setIsConfirmationOpen(false)
  }

  const handleDeactivationConfirm = () => {
    setIsEnabled(false)
    setIsConfirmationOpen(false)
  }

  return (
    <div>
      <div className="flex items-center space-x-2">
        <div
          onClick={() => {
            if (isEnabled) {
              handleDeactivationRequest()
            } else {
              setIsEnabled(!isEnabled)
              handleModalOpen()
            }
          }}
          className={`cursor-pointer w-14 h-8 rounded-full ${isEnabled ? "bg-blue-600" : "bg-gray-300"} flex items-center justify-between p-1 transition-all duration-300 ease-in-out`}
        >
          <div
            className={`w-6 h-6 bg-white rounded-full transition-all duration-300 ease-in-out ${isEnabled ? "transform translate-x-6" : ""}`}
          />
        </div>

        <label htmlFor="authentification" className="text-xl font-semibold">Activer Authentification</label>
      </div>

      <DoubleAuthentificationModal
        open={isModalOpen}
        onClose={handleModalClose}
        onActivate={handleActivate}
        onCancel={handleCancel} 
      />

      <ConfirmationModal
        open={isConfirmationOpen}
        onConfirm={handleDeactivationConfirm}
        onCancel={handleDeactivationCancel}
      />
    </div>
  )
}
