import { useApi } from "../useApi";
import { Username } from "@/components/profil/type/profilInterface";

export const useModifProfilApi = () => {
	const modifProfil = useApi<Username>(
		"/user/update",
		{
			method: 'PUT',
			immediate: false,
			onSuccess: (res) => {
			if (!res ) {
				console.error("Erreur modif profil: réponse invalide", res)
				return
			}
			},
			onError: (errMsg) => {
				console.error('Erreur modif profil :', errMsg)
			},
		  }
	);
	return {
		modifProfil
	};
}