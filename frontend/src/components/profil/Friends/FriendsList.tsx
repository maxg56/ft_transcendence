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
	return (
		<div className="w-full p-4 bg-white shadow-lg rounded-lg">
			<h3 className="font-bold mb-2 text-2xl">Liste d’amis</h3>
			<div className="max-h-60 overflow-y-auto pr-1">
				<ul className="space-y-2 text-xl">
					{friends.map((friend, index) => (
						<li key={`friend-${index}`} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
							<img
								src={`https://robohash.org/${friend.username}`}
								alt={friend.username}
								className="w-8 h-8 rounded-full"
							/>
							<span className="truncate max-w-[200px]">{friend.username}</span>
						</li>
					))}
					{sentInvitations.map((inv, index) => (
						<li key={`inv-${index}`} className="flex items-center gap-2 bg-gray-200 p-2 rounded opacity-60 italic">
							<img
								src={`https://robohash.org/${inv.username}`}
								alt={inv.username}
								className="w-8 h-8 rounded-full"
							/>
							<span className="truncate max-w-[200px]">{inv.username} (En attente)</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default FriendList;
