import { useTranslation } from "@/context/TranslationContext";
import React from "react";

interface Invitation {
	username: string;
	avatar: string | null;
}

interface FriendListProps {
	friends: Invitation[];
	sentInvitations: Invitation[];
}

const FriendList: React.FC<FriendListProps> = ({ friends, sentInvitations }) => {
	const {t} = useTranslation();
	return (
		<div className="w-full p-4 backdrop-blur-md bg-gradient-to-br from-cyan-400/10 via-purple-500/10 shadow-lg rounded-lg">
			<h3 className="font-bold mb-2 text-2xl text-cyan-200 ">{t("Liste d’amis")}</h3>
			<div className="max-h-40 overflow-y-auto pr-1 font-bold mb-2 text-2xl">
				<ul className="space-y-2 text-xl ">
					{friends.map((friend, index) => (
						<li key={`friend-${index}`} className="flex items-center gap-2 p-2 border-cyan-300/30 backdrop-blur-md bg-gradient-to-br from-cyan-400/10 via-purple-500/10 to-transparent shadow-lg rounded-lg">
							<img
								src={friend.avatar || `https://robohash.org/${friend.username}`}
								alt={friend.username}
								className="w-8 h-8 rounded-full"
							/>
							<span className="truncate max-w-[200px]">{friend.username}</span>
						</li>
					))}
					{sentInvitations.map((inv, index) => (
						<li key={`inv-${index}`} className="flex items-center gap-2 bg-gray-200 p-2 border-cyan-300/30 backdrop-blur-md bg-gradient-to-br from-cyan-400/60 via-purple-500/40 to-transparent shadow-lg rounded-lgitalic">
							<img
								src={`https://robohash.org/${inv.username}`}
								alt={inv.username}
								className="w-8 h-8 rounded-full"
							/>
							<span className="truncate max-w-[200px]">{inv.username} {t("(En attente)")}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default FriendList;
