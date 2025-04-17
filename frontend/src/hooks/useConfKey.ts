// hooks/useConfKey.ts
import { useState } from 'react';

export const useConfKey = () => {
	const [confKey, setConfKey] = useState<{ [key: string]: string }>({
		p1_up: 'w',
		p1_down: 's',
		p2_up: 'ArrowUp',
		p2_down: 'ArrowDown',
		p3_up: '5',
		p3_down: '6',
		p4_up: 'i',
		p4_down: 'k',
		pause: 'p',
	});

	const changeKey = (action: string, newKey: string) => {
		setConfKey((prev) => ({
			...prev,
			[action]: newKey,
		}));
	};

	return { confKey, changeKey };
};
// <button onClick={() => changeKey('up', 'z')}>Monter avec Z</button>
