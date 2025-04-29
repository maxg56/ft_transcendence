import { useNavigate, useLocation } from "react-router-dom";
import { useCallback } from "react";

const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = useCallback(
    (path: string) => {
      if (path !== location.pathname) {
        navigate(path);
      }
    },
    [navigate, location.pathname]
  );

  return {
    path: location.pathname,
    navigate: goTo,
  };
};

export default useNavigation;
