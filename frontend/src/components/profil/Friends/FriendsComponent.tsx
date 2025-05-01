import React, { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import FriendList from "./FriendsList";
import { useApi } from "@/hooks/api/useApi";
import { Username, Invitation, FriendListProps } from "../type/friendsIntefarce";
import { useFriendApi } from "@/hooks/api/profile/ApiFriends/ApiFriendsAccept";

const FriendsPanel: React.FC = () => {
	const [research, setResearch] = useState<string[]>([]);
	const [pendingG, setPending] = useState<string[]>([]);
	const [friends, setFriends] = useState<string[]>([]);
	const [sentInvitations, setSentInvitations] = useState<Invitation[]>([])
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUsers, setFilteredUsers] = useState<string[]>([]);

	const {
		acceptFriend,
		refuseFriend,
		addFriend
	} = useFriendApi();

	const {refetch: fetchResearch} = useApi<Username[]>(
		"/user/users",
		{
			immediate: false,
			onSuccess: (res) => {
			if (!res ) {
				console.error("Erreur research list", res)
				return
			}
			const usernames = res.data.map(research => research.username);
			setResearch(usernames)
			},
			onError: (errMsg) => {
				console.error('Erreur researchlist :', errMsg)
			},
		}
	)

	const {refetch: fetchPendingList} = useApi<Username[]>(
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

	const handleAddFriends = async (username: string) => {
		await addFriend.refetch({ username });
		
	}

	const handleResearch = async (value: string) => {
		setSearchTerm(value);

		if(value.length < 2){
			setFilteredUsers([]);
			return;
		}

		if (research.length === 0){
			await fetchResearch();
		}
		const results = research.filter(username => username.toLocaleLowerCase().includes(value.toLocaleLowerCase())
	);
	setFilteredUsers(results);
	};

	return (
		<div className="space-y-4">
			<div>
				<h3 className="font-bold mb-2 text-xs">Rechercher un ami</h3>
				<input
					type="text"
					value={searchTerm}
					onChange={(e) => handleResearch(e.target.value)}
					placeholder="Nom d'utilisateur..."
					className="w-full px-2 py-2 border border-gray-300 rounded-md text-xs"
				/>
				<ul className="mt-2 space-y-1">
				{filteredUsers.map((username) => (
					<li key={username} className="flex justify-between items-center text-xs border px-2 py-1 rounded">
						<span>{username}</span>
						<button
							className="bg-blue-500 text-white px-2 py-1 rounded"
							onClick={() => handleAddFriends(username)}
						>
							Inviter
						</button>
					</li>
				))}
			</ul>
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
