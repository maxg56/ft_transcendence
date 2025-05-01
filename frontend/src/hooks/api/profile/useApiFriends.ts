import { useApi } from "../useApi";
import { Username } from "@/components/profil/type/friendsIntefarce";

export const useFriendApi = () => {
const acceptFriend = useApi<Username>(
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

const refuseFriend = useApi<Username>(
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

const addFriend = useApi<Username>(
	"/user/friend/add",
	{
		method: 'POST',
		immediate: false,
		onSuccess: (res) => {
		if (!res ) {
			console.error("Erreur adding friend : réponse invalide", res)
			return
		}
		},
		onError: (errMsg) => {
			console.error('Erreur adding friends :', errMsg)
		},
	}
);

return {
	refuseFriend,
	acceptFriend,
	addFriend
};
}