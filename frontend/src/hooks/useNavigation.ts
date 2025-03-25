import { useState, useEffect } from "react";

const useNavigation = () => {
	const [path, setPath] = useState(window.location.pathname);

	useEffect(() => {
		const onPopState = () => setPath(window.location.pathname);
		window.addEventListener("popstate", onPopState);
		window.addEventListener("navigation", onPopState); // 🔥 Écoute l'événement personnalisé
		return () => {
			window.removeEventListener("popstate", onPopState);
			window.removeEventListener("navigation", onPopState);
		};
	}, []);

	const navigate = (newPath: string) => {
		if (newPath !== window.location.pathname) {
			console.log(`🚀 Navigation vers : ${newPath}`);
			window.history.pushState({}, "", newPath);
			setPath(newPath);
			window.dispatchEvent(new Event("navigation")); // 🔥 Force un événement global
		}
	};
	
	
	return{path, navigate};
}

export default useNavigation