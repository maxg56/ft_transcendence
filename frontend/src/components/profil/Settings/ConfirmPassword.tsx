import { useState } from "react"
import { Modal } from "@/components/ModalCompo"
import PasswordInput from "@/components/Auth/PasswordInput"
import { useModifPassword } from "@/hooks/api/profile/useApiModifPassword"
import { Password } from "../type/profilInterface"
import { useTranslation } from "@/context/TranslationContext"

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
	const {t} = useTranslation();
	return (
		<Modal onClose={onClose}>
			<div className="absolute w-[500px] bottom-[10%] left-1/2 -translate-x-1/2 
  							rounded-2xl text-black px-6 py-4 bg-blue-500
  							z-50
							">
				<h2 className="text-g font-bold text-center">{t("Modifier Mot de Passe")}</h2>
				
				<PasswordInput
					placeholder={t("Nouveau mot de passe")}
					value={password}
					onChange={(e) => {
						setNewPassword(e.target.value);
						setErrorMessage("");}}
				/>

				<PasswordInput
					placeholder={t("Confirmer le mot de passe")}
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
						{t("Annuler")}
					</button>
					<button
						onClick={handleConfirm}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-2xl"
					>
						{t("Confirmer")}
					</button>
				</div>
			</div>
		</Modal>
	)
}
