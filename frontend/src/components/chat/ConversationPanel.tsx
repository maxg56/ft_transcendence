import React from "react";

interface Props {
	messages: string[];
	selectedUser: string | null;
}

// const currentUser = "Moi"; // Nom fictif pour toi

const ConversationPanel: React.FC<Props> = ({ messages, selectedUser }) => {
	if (!selectedUser) {
		return (
			<div className="flex items-center justify-center h-full text-gray-500">
				Sélectionne un utilisateur pour commencer une conversation
			</div>
		);
	}

	return (
		<div className="space-y-2 bg-gray-200 rounded-2xl">
			{messages.map((msg, index) => {
				const isFromMe = !msg.startsWith(`${selectedUser}: `);

				const content = isFromMe ? msg : msg.replace(`${selectedUser}: `, "");

				return (
					<div
						key={index}
						className={`flex ${
							isFromMe ? "justify-end" : "justify-start"
						}`}
					>
						<div
							className={`px-4 py-2 rounded-lg max-w-xs text-sm ${
								isFromMe
									? "bg-blue-500 text-white"
									: "bg-gray-300 text-black"
							}`}
						>
							{content}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default ConversationPanel;
