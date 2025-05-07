import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "../ModalCompo";
import ConversationList from "./ConversationLists";
import ConversationPanel from "./ConversationPanel";

const PrivateMessage: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<{ [user: string]: string[] }>({});
	const [selectedUser, setSelectedUser] = useState<string | null>(null);

	const handleSendMessage = useCallback(() => {
		if (!selectedUser || message.trim() === "")
			return;
	
		setMessages((prev) => ({
			...prev,
			[selectedUser]: [...(prev[selectedUser] || []), message],
		}));
		setMessage("");
	}, [message, selectedUser]);

	const handleUserSelect = (userName: string) => {
		setSelectedUser(userName);
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				if (message.trim() !== "") {
					handleSendMessage();
				}
			}
		};
	
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [message, handleSendMessage]);

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className="px-3 py-1 bg-blue-500 text-white text-sm rounded-2xl hover:bg-blue-600"
			>
				Messages
			</button>

			{open && (
				<Modal onClose={() => setOpen(false)}>
					<div className="flex w-[1200px] h-[800px] bg-white rounded-lg shadow-lg overflow-hidden">
						<ConversationList 
							onUserSelect={handleUserSelect}
							selectedUser={selectedUser}
							/>
						<div className="flex flex-col flex-1 overflow-auto">
							<div className="flex-1 overflow-y-auto p-4 ">
							<ConversationPanel
								messages={selectedUser ? messages[selectedUser] || [] : []}
								selectedUser={selectedUser}
								/>
							</div>

							<div className="p-3 border-t flex gap-2">
								<input
									value={message}
									onChange={(e) =>
										setMessage(e.target.value)
									}
									className="flex-1 border rounded-md p-2 text-sm"
									type="text"
									placeholder="Écrire un message..."
								/>
								<button
									onClick={handleSendMessage}
									className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
								>
									Envoyer
								</button>
							</div>
						</div>
					</div>
				</Modal>
			)}
		</>
	);
};

export default PrivateMessage;
