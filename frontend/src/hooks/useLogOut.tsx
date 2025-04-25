import React, { createContext, useContext } from "react";
import useNavigation from "../hooks/useNavigation";

type LogoutContextType = {
	logout: () => void;
};

const LogoutContext = createContext<LogoutContextType | undefined>(undefined);

export const LogoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { navigate } = useNavigation();

	const logout = () => {
		localStorage.removeItem("token");
		navigate("/");
	};

	return (
		<LogoutContext.Provider value={{ logout }}>
			{children}
		</LogoutContext.Provider>
	);
};

export const useLogout = (): LogoutContextType => {
	const context = useContext(LogoutContext);
	if (!context) {
		throw new Error("useLogout must be used within a LogoutProvider");
	}
	return context;
};