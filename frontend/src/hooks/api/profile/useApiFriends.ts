import { useApi } from "../useApi";
import { Invitation } from "@/components/profil/type/friendsInterface";


export const useFriendApi = () => {
const acceptFriend = useApi<Invitation>(
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

const refuseFriend = useApi<Invitation>(
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

const addFriend = useApi<Invitation>(
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

const removeFriend = useApi<Invitation>(
	"/user/friend/remove",
	{
		method: 'PUT',
		immediate: false,
		onSuccess: (res) => {
		if (!res ) {
			console.error("Erreur removing friend : réponse invalide", res)
			return
		}
		},
		onError: (errMsg) => {
			console.error('Erreur removing friends :', errMsg)
		},
	}
);

return {
	refuseFriend,
	acceptFriend,
	addFriend,
	removeFriend
};
}