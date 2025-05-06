import { useState } from "react"
import { Modal } from "@/components/ModalCompo"
import PasswordInput from "@/components/Auth/PasswordInput"
import { useModifPassword } from "@/hooks/api/profile/useApiModifPassword"
import { Password } from "../type/profilInterface"

interface ConfirmPasswordModalProps {
	onClose: () => void
}

export const ConfirmPasswordModal = ({
	onClose,
}: ConfirmPasswordModalProps) => {
	const [password, setNewPassword] = useState("")
	const [confirmation, setConfirmation] = useState("")
	const [errorMessage, setErrorMessage] = useState("");

	const { modifPassword } = useModifPassword();

	const handleConfirm = async () => {
		if (confirmation !== password) {
			setErrorMessage("les mots de passe ne correspondentt pas")
			return;
		}
		const updatedNewPassword: Password = { password }
		await modifPassword.refetch(updatedNewPassword);
		setNewPassword("")
		setConfirmation("")
		setErrorMessage("")
		onClose()
	}

	return (
		<Modal onClose={onClose}>
			<div className="flex flex-col space-y-4 w-[800px]">
				<h2 className="text-lg font-bold text-center">Modifier le mot de passe</h2>
				
				<PasswordInput
					placeholder="Nouveau mot de passe"
					value={password}
					onChange={(e) => {
						setNewPassword(e.target.value);
						setErrorMessage("");}}
				/>

				<PasswordInput
					placeholder="Confirmer le mot de passe"
					value={confirmation}
					onChange={(e) => {
						setConfirmation(e.target.value);
						setErrorMessage("")}}
				/>

				{errorMessage && (
          			<p className="text-red-600 font-medium text-center">{errorMessage}</p>
        		)}

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
