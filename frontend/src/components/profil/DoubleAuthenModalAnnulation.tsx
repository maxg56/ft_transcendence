import React from "react"

interface ConfirmationModalProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ open, onConfirm, onCancel }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <h3 className="text-lg font-semibold mb-4">Êtes-vous sûr ?</h3>
        <p className="text-sm mb-6">Êtes-vous sûr de vouloir désactiver l'authentification à deux facteurs ?</p>
        <div className="flex justify-between">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white size-[100px] rounded-md"
          >
            Oui
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 size-[100px] rounded-md"
          >
            Non
          </button>
        </div>
      </div>
    </div>
  )
}
