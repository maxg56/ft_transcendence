import { useApi } from "../../useApi";
import { Accepting, Refusing } from "@/components/profil/type/friendsIntefarce";

export const useFriendApi = () => {
const acceptFriend = useApi<Accepting>(
	"/user/friend/accept",
	{
		method: 'PUT',
		immediate: false,
		onSuccess: (res) => {
		if (!res ) {
			console.error("Erreur accepting friend : réponse invalide", res)
			return
		}
		},
		onError: (errMsg) => {
			console.error('Erreur accepting friends :', errMsg)
		},
	  }
);

const refuseFriend = useApi<Refusing>(
	"/user/friend/refuse",
	{
		method: 'PUT',
		immediate: false,
		onSuccess: (res) => {
		if (!res ) {
			console.error("Erreur refusing friend : réponse invalide", res)
			return
		}
		},
		onError: (errMsg) => {
			console.error('Erreur refusing friends :', errMsg)
		},
	}
);

return {
	refuseFriend,
	acceptFriend
};
}