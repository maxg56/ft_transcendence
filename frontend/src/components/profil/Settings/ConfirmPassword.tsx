import { useState } from "react"
import { Modal } from "@/components/ModalCompo"

interface ConfirmPasswordModalProps {
	passwordToMatch: string
	onConfirm: () => void
	onClose: () => void
}

export const ConfirmPasswordModal = ({
	passwordToMatch,
	onConfirm,
	onClose,
}: ConfirmPasswordModalProps) => {
	const [newPassword, setNewPassword] = useState("")
	const [confirmation, setConfirmation] = useState("")

	const handleConfirm = () => {
		if (confirmation === newPassword && newPassword === passwordToMatch) {
			onConfirm()
			onClose()
			setNewPassword("")
			setConfirmation("")
		} else {
			alert("Les mots de passe ne correspondent pas.")
		}
	}

	return (
		<Modal onClose={onClose}>
			<div className="flex flex-col space-y-4 w-[800px]">
				<h2 className="text-lg font-bold text-center">Modifier le mot de passe</h2>
				
				<input
					type="password"
					placeholder="Nouveau mot de passe"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					className="border px-3 py-2 rounded-md text-xl"
				/>

				<input
					type="password"
					placeholder="Confirmer le mot de passe"
					value={confirmation}
					onChange={(e) => setConfirmation(e.target.value)}
					className="border px-3 py-2 rounded-md text-xl"
				/>

				<div className="flex justify-end space-x-2">
					<button
						onClick={onClose}
						className="px-3 py-1 text-gray-700 hover:text-gray-900 text-2xl"
					>
						Annuler
					</button>
					<button
						onClick={handleConfirm}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-2xl"
					>
						Confirmer
					</button>
				</div>
			</div>
		</Modal>
	)
}
