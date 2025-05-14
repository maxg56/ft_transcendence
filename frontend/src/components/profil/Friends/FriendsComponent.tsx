import React, { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import FriendList from "./FriendsList";
import { useApi } from "@/hooks/api/useApi";
import { Invitation, APIFriendListProps } from "../type/friendsInterface";
import { Username } from "../type/profilInterface";
import { useFriendApi } from "@/hooks/api/profile/useApiFriends";
import { useTranslation } from "@/context/TranslationContext";

const FriendsPanel: React.FC = () => {
	const [research, setResearch] = useState<string[]>([]);
	const [pendingG, setPending] = useState<string[]>([]);
	const [friends, setFriends] = useState<Invitation[]>([]);
	const [sentInvitations, setSentInvitations] = useState<Invitation[]>([])
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUsers, setFilteredUsers] = useState<string[]>([]);
	const {t} = useTranslation();
	const {
		acceptFriend,
		refuseFriend,
		addFriend
	} = useFriendApi();

	const {refetch: fetchResearch} = useApi<Username[]>(
		"/user/users",
		{
			immediate: false,
			onSuccess: (data) => {
				if (!data ) {
					console.error("Erreur research list", data)
					return
				}
				const usernames = data.map(research => research.username);
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
			onSuccess: (data) => {
			if (!data ) {
				console.error("Erreur pending list", data)
				return
			}
			const usernames = Array.isArray(data) ? data.map(pending => pending.username) : []
			setPending(usernames)
			},
			onError: (errMsg) => {
				console.error('Erreur pemdimglist :', errMsg)
			},
		}
	)
	
	const {refetch: fetchfriendList } = useApi<APIFriendListProps>(
		"/user/friend/list",
		{
			immediate: false,
			onSuccess: (data) => {
			if (!data ) {
				console.error("Erreur friends list", data)
				return
			}
			setFriends(data.friendList);
			setSentInvitations(data.pendingList);
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
		<div className="space-y-6 text-white">
  			{/* Search Friend */}
  			<div className=" rounded-2xl border p-2 m-left-8 border-cyan-300/30 backdrop-blur-md bg-gradient-to-br from-cyan-400/10 via-purple-500/10 to-transparent shadow-[inset_0_0_20px_rgba(0,255,255,0.1),0_0_15px_rgba(0,255,255,0.1)] transition duration-300">
    			<h3 className="font-bold mb-4 text-2xl text-cyan-200">{t("Rechercher un ami")}</h3>
    				<input
      					type="text"
      					value={searchTerm}
      					onChange={(e) => handleResearch(e.target.value)}
      					placeholder={t("Nom d'utilisateur...")}
      					className="w-full px-2 py-2 rounded-md bg-white/10 border border-cyan-300/20 text-white placeholder-cyan-100  focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
    					/>
    				<ul className="mt-4 space-y-2">
      					{filteredUsers.map((username) => (
        					<li key={username} className="flex justify-between items-center text-sm px-4 py-2 rounded-md bg-white/5 border border-cyan-200/10 shadow-sm">
          						<span>{username}</span>
          						<button
            						className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-3 py-1 rounded text-xs transition"
            							onClick={() => handleAddFriends(username)}
          								>
            						{t("Inviter")}
          						</button>
        					</li>
      					))}
    				</ul>
  			</div>

  			{/* Friend List Component */}
  			<FriendList friends={friends} sentInvitations={sentInvitations} />

  			{/* Invitations Received */}
  			<div className="p-2 rounded-2xl border border-cyan-300/30 backdrop-blur-md bg-gradient-to-br from-cyan-400/10 via-purple-500/10 to-transparent shadow-[inset_0_0_20px_rgba(0,255,255,0.1),0_0_15px_rgba(0,255,255,0.1)] transition duration-300">
    			<h3 className="font-bold mb-4 text-2xl text-cyan-200">{t("Invitations reçues")}</h3>
    			<div className="max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
      				<ul className="space-y-2 text-base">
        			{pendingG.map((user, index) => (
          			<li key={index} className="bg-white/5 border border-cyan-200/10 p-2 rounded-md flex justify-between items-center">
            			<span>{user}</span>
            			<div className="space-x-2">
              				<button
                				onClick={() => handleAccept(user)}
                				className="text-green-400 hover:text-green-300"
              					>
                				<Check />
              				</button>
              				<button
                				onClick={() => handleRefuse(user)}
                				className="text-red-400 hover:text-red-300"
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
	);
};

export default FriendsPanel;
