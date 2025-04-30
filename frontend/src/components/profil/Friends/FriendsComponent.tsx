import React, { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import FriendList from "./FriendsList";
import { useApi } from "@/hooks/api/useApi";
import { Pending, Invitation, FriendListProps } from "../type/friendsIntefarce";
import { useFriendApi } from "@/hooks/api/profile/ApiFriends/ApiFriendsAccept";

const FriendsPanel: React.FC = () => {
	const [pendingG, setPending] = useState<string[]>([]);
	const [friends, setFriends] = useState<string[]>([]);
	const [sentInvitations, setSentInvitations] = useState<Invitation[]>([])

	const {
		acceptFriend,
		refuseFriend
	} = useFriendApi();

	const {refetch: fetchPendingList} = useApi<Pending[]>(
		"/user/friend/pendinglist",
		{
			immediate: false,
			onSuccess: (res) => {
			if (!res ) {
				console.error("Erreur pending list", res)
				return
			}
			const usernames = res.data.map(pending => pending.username);
			setPending(usernames)
			},
			onError: (errMsg) => {
				console.error('Erreur pemdimglist :', errMsg)
			},
		}
	)
	
	const {refetch: fetchfriendList } = useApi<FriendListProps[]>(
		"/user/friend/list",
		{
			immediate: false,
			onSuccess: (res) => {
			if (!res ) {
				console.error("Erreur friends list", res)
				return
			}
			const friendListUsername = res.data.friendList.map(friends => friends);
			const friendListPending = res.data.pendingList.map(sentInvitations => sentInvitations)
			setFriends(friendListUsername)
			setSentInvitations(friendListPending)
			},
			onError: (errMsg) => {
			
			console.error('Erreur friendList :', errMsg)
			},
		}
	)

	useEffect(() => {
		const fetchData = async () => {
			await fetchPendingList();
			await fetchfriendList();
			
			setTimeout(() => {
			fetchData();
			}, 5000);
		};
		
		fetchData();
		}, []
	);
		  
	const handleAccept = async (username: string) => {
		await acceptFriend.refetch({ username });
		setPending(prev => prev.filter((u) => u !== username));
	};
	
	const handleRefuse = async (username: string) => {
		await refuseFriend.refetch({ username });
		setPending(prev => prev.filter((u) => u !== username));
	};

	return (
		<div className="space-y-4">
			<div>
				<h3 className="font-bold mb-2 text-xs">Rechercher un ami</h3>
				<input
					type="text"
					placeholder="Nom d'utilisateur..."
					className="w-full px-2 py-2 border border-gray-300 rounded-md text-xs"
				/>
			</div>
			<FriendList friends={friends} sentInvitations={sentInvitations} />

			<div className="flex gap-8">
				<div className="w-full p-4 bg-white shadow-lg rounded-lg">
					<h3 className="font-bold mb-2 text-xs">Invitations reçues</h3>
						<div className="max-h-48 overflow-y-auto pr-4">
							<ul className="space-y-2 text-xs">
							{pendingG.map((user, index) => (
								<li key={index} className="bg-gray-100 p-2 rounded flex justify-between items-center">
								<span>{user}</span>
								<div className="space-x-2">
									<button
									onClick={() => handleAccept(user)}
									className="text-green-600 hover:underline text-xs"
									>
									<Check />
									</button>
									<button
									onClick={() => handleRefuse(user)}
									className="text-red-600 hover:underline text-xs"
									>
									<X />
									</button>
								</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FriendsPanel;
