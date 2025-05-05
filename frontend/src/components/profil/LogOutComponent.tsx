import React from "react";
import { useLogout } from "@/hooks/useLogOut";

const LogoutButton: React.FC = () => {
	const { logout } = useLogout();

	return (
		<button
			onClick={logout}
			className="bg-red-500 text-white px-4 py-2 rounded-2xl hover:bg-red-600"
		>
			Log Out
		</button>
	);
};

export default LogoutButton;