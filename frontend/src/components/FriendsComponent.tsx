import React, { useState } from "react";
import { X, Check } from "lucide-react";
import FriendList from "./FriendsList";

interface Invitation {
	username: string;
	status: string;
}

const FriendsPanel: React.FC = () => {
	const [friends, setFriends] = useState<string[]>(["Alice", "Tom", "Anna"]);
	const [sentInvitations, setSentInvitations] = useState<Invitation[]>([
		{ username: "@Tom", status: "En attente" },
		{ username: "@Julie", status: "En attente" }
	]);
	const [receivedInvitations, setReceivedInvitations] = useState<string[]>([
		"@Lucas",
		"@Emma",
		"Pedro",
		"Jumanji",
		"Bozo"
	]);

	const handleAccept = (username: string) => {
		setFriends([...friends, username]);
		setReceivedInvitations(receivedInvitations.filter(user => user !== username));
	};

	const handleRefuse = (username: string) => {
		setReceivedInvitations(receivedInvitations.filter(user => user !== username));
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
							{receivedInvitations.map((user, index) => (
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
