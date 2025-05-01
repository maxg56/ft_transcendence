import { useApi } from "../useApi";
import { UserModif } from "@/components/profil/type/profilInterface";
import { Username } from "@/components/profil/type/friendsIntefarce";

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