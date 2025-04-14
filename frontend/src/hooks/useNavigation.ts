import { useState, useEffect } from "react";

const useNavigation = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
	const onPopState = () => {
	  setPath((prevPath) => {
		if (prevPath !== window.location.pathname) {
		  return window.location.pathname;
		}
		return prevPath;
	  });
	};
  
	window.addEventListener("popstate", onPopState);
	window.addEventListener("navigation", onPopState);
  
	return () => {
	  window.removeEventListener("popstate", onPopState);
	  window.removeEventListener("navigation", onPopState);
	};
  }, []);
  // 🔥 On ne met pas [path] pour éviter une boucle infinie

  const navigate = (newPath: string) => {
    if (newPath === path) return; // 🔥 Bloque les navigations redondantes
    window.history.pushState({}, "", newPath);
    setPath(newPath);
    window.dispatchEvent(new Event("navigation"));
  };

  return { path, navigate };
};

export default useNavigation;