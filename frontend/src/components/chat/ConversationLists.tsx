import React from "react";

interface Props {
	onUserSelect: (user: string) => void;
	selectedUser: string | null;
}

const users = ["Alice", "Bob", "Charlie"];

const ConversationList: React.FC<Props> = ({ onUserSelect, selectedUser }) => {
	return (
		<div className="w-1/4 border-r overflow-y-auto bg-gray-200 rounded-2xl flex flex-col">
			<div className="gap-6">
				<input
				type="text"
				placeholder="Nom d'utilisateur..."
				className="w-full px-2 py-2 border border-gray-300 rounded-md text-xs"
				/>
			</div>
			{users.map((user) => (
				<div
					key={user}
					onClick={() => onUserSelect(user)}
					className={`p-4 cursor-pointer hover:bg-gray-300  ${
						selectedUser === user ? "bg-gray-300 font-semibold" : ""
					}`}
				>
					{user}
			</div>
			))}
		</div>
	);
};

export default ConversationList;
