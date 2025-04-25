// hooks/useConfKey.ts
import React, {createContext, useState, useContext, ReactNode} from 'react';

type ConfKeyMap = {
	p1_up: string;
	p1_down: string;
	p2_up: string;
	p2_down: string;
	p3_up: string;
	p3_down: string;
	p4_up: string;
	p4_down: string;
	pause: string;
}

type ConfKeyContextType = {
	confKey: ConfKeyMap;
	changeKey: (action: keyof ConfKeyMap, newKey: string) => void;
}

const ConfKeyContext = createContext<ConfKeyContextType | undefined>(undefined);


export const ConfKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [confKey, setConfKey] = useState<ConfKeyMap>({
		p1_up: "w",
		p1_down: "s",
		p2_up: "ArrowUp",
		p2_down: "ArrowDown",
		p3_up: "5",
		p3_down: "6",
		p4_up: "i",
		p4_down: "k",
		pause: "p"
	});

	const changeKey = (action: keyof ConfKeyMap, newKey: string) => {
		setConfKey((prev) => ({
			...prev,
			[action]: newKey,
		}));
	};

	return (
		<ConfKeyContext.Provider value={{ confKey, changeKey }}>
			{children}
		</ConfKeyContext.Provider>
	);
};
	export const useConfKey = (): ConfKeyContextType => {
		const context = useContext(ConfKeyContext);
		if (!context) {
			throw new Error("useConfKey must be used within a ConfKeyProvider");
		}
		return context;
};
// <button onClick={() => changeKey('up', 'z')}>Monter avec Z</button>
