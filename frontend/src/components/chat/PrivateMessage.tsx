import React, {useState} from "react";
import { Modal } from "../ModalCompo";

const PrivateMessage: React.FC = () => {
	const [open, setOpen] = useState(false)
	return(
		<>
			<button onClick={() => setOpen(true)}
			className="px-3 py-1 bg-blue-500 text-white text-sm rounded-2xl hover:bg-blue-600">
				Messages
			</button>
		
			{open && (
				<Modal onClose={() => setOpen(false)}>

				</Modal>
			)

			}
		</>
	)
}

export default PrivateMessage;