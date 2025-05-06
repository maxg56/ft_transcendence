import { useApi } from "../useApi";
import { Password } from "@/components/profil/type/profilInterface";

export const useModifPassword = () => {
	const modifPassword = useApi<Password>(
		"/user/password",
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
		modifPassword
	};
}