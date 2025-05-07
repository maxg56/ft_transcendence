import React, {useEffect, useRef} from "react";

interface Props {
	messages: string[];
	selectedUser: string | null;
}

const ConversationPanel: React.FC<Props> = ({ messages, selectedUser }) => {
	
	const endRef = useRef<HTMLDivElement | null>(null);
	
	useEffect(() => {
		if(endRef.current)
			endRef.current.scrollIntoView({behavior: "smooth"})
	})

	return (
		<div className="flex flex-col overflow-y-auto justify-end space-y-3 bg-gray-100 rounded-2xl  scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-200">
			{selectedUser && (
				<div className="text-lg text-center font-semibold text-gray-700 ">
					{selectedUser}
				</div>
			)}
			{messages.map((msg, idx) => (
				<div
					key={idx}
					className="bg-blue-100 max-w-xs self-end rounded-lg px-3 py-2 text-sm break-words "
				>
					{msg}
				</div>
			))}
			<div ref={endRef} />
		</div>
	);
};

export default ConversationPanel;
