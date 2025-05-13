"use client"

import { useState } from "react"
import { Modal } from "../ModalCompo"
import { useApi } from "@/hooks/api/useApi"
import { useLogout } from "@/hooks/useLogOut"
import { useTranslation } from "@/context/TranslationContext"

const DeleteAccountModal = () => {
	const [open, setOpen] = useState(false)
	const { logout } = useLogout();
	const {t} = useTranslation();

	const deleteAccount = useApi<void>(
		"/user/delete",
		{
			method: "PUT",
			body: {},
			immediate: false,
			onSuccess: () => {
				alert("Compte supprimé avec succès")
			},
			onError: (err) => {
				alert("Une erreur est survenue lors de la suppression du compte.")
				console.error(err)
			},
		})
	
	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className="px-3 py-1 bg-red-500 text-white text-sm rounded-2xl hover:bg-red-600 w-full"
			>
				{t("Supprimer mon compte")}
			</button>

			{open && (
				<Modal onClose={() => setOpen(false)}>
					<div className="flex flex-col gap-4 w-[600px]">
						<h2 className="text-xl-black font-bold text-red-600 text-center">{t("Confirmation")}</h2>
						<div className="flex flex-col gap-4 ">
							<p className="text-center text-xl">{t("Es-tu sûr de vouloir supprimer ton compte ?")}</p>
							<p className="text-center text-sm">{t("Cette action est definitive")}</p>
						</div>
						<div className="flex justify-between">
							<button
								onClick={() => setOpen(false)}
								className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
							>
								{t("Annuler")}
							</button>
							<button
								onClick={async () => {
									await deleteAccount.refetch()
									logout()
									setOpen(false)
								}}
								className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
							>
								{t("Supprimer")}
							</button>
						</div>
					</div>
				</Modal>
			)}
		</>
	)
}

export default DeleteAccountModal
