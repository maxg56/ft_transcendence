import React, { useState, useEffect } from "react";
import { Modal } from "../ModalCompo";
import ConversationList from "./ConversationLists";
import ConversationPanel from "./ConversationPanel";

const PrivateMessage: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [selectedUser, setSelectedUser] = useState<string | null>(null);
	// const [messages, setMessages] = useState<{ [user: string]: string[] }>({});
	// const [unread, setUnread] = useState<{[user: string]: boolean}>({});
	const [messages, setMessages] = useState<{ [user: string]: string[] }>({
		Bob: ["Salut, t'es là ?"]
	});
	const [unread, setUnread] = useState<{ [user: string]: boolean }>({
		Bob: true
	});
	
	
	const handleSendMessage = () => {
		if (!selectedUser || message.trim() === "")
			return;
		
		setMessages((prev) => ({
			...prev,
			[selectedUser]: [...(prev[selectedUser] || []), message],
		}));
		
		setMessage("");
	};

	const handleUserSelect = (userName: string) => {
		setSelectedUser(userName);
		setUnread((prev) => ({ ...prev, [userName]: false }));
	};
	
	const simulateReceivedMessage = (fromUser: string, text: string) => {
		setMessages((prev) => ({
			...prev,
			[fromUser]: [...(prev[fromUser] || []), text],
		}));
		
		if (selectedUser !== fromUser) {
			setUnread((prev) => ({ ...prev, [fromUser]: true }));
		}
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
	}, [message]);
	
	const hasUnreadMessages = Object.values(unread).some((val) => val);

	return (
		<>
			<div className="relative inline-block">
				<button
					onClick={() => setOpen(true)}
					className="px-3 py-1 bg-blue-500 text-white text-sm rounded-2xl hover:bg-blue-600 relative"
				>
					Messages
					{hasUnreadMessages && (
						<span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white"></span>
					)}
				</button>
			</div>
			{open && (
				<Modal onClose={() => setOpen(false)}>
					<div className="flex w-[1200px] h-[800px] bg-white rounded-lg shadow-lg overflow-hidden">
						<ConversationList
							onUserSelect={handleUserSelect}
							selectedUser={selectedUser}
							unread={unread}
						/>
						<div className="flex flex-col flex-1 overflow-auto">
							<div className="flex-1 overflow-y-auto p-4">
								<ConversationPanel
									messages={selectedUser ? messages[selectedUser] || [] : []}
									selectedUser={selectedUser}
								/>
							</div>

							<div className="p-3 border-t flex gap-2">
								<input
									value={message}
									onChange={(e) => setMessage(e.target.value)}
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
								<button
									onClick={() =>
										simulateReceivedMessage("Bob", "Bob: Hé, tu réponds pas ?")
									}
									className="bg-green-500 text-white px-4 py-2 rounded-md text-sm"
								>
									Simuler message reçu
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

