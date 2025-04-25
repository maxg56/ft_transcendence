// hooks/useCountdown.ts
import { useEffect, useRef, useState } from 'react';

export const useCountdown = (
	start: number,
	onDone: () => void,
	key: number 
): number => {
	const [countdown, setCountdown] = useState(start);
	const intervalRef = useRef<number | null>(null);

	useEffect(() => {
		setCountdown(start);

		if (intervalRef.current !== null) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		intervalRef.current = window.setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 0) {
					clearInterval(intervalRef.current!);
					intervalRef.current = null;
					onDone();
					return -1;
				}
				return prev - 1;
			});
		}, 1000);

		return () => {
			if (intervalRef.current !== null) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [start, onDone, key]); // dépend aussi de key

	return countdown;
};

