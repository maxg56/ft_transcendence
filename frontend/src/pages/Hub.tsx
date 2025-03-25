import React from "react";
import useNavigation from "../hooks/useNavigation";

const Hub: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <div>
      <h1>Bienvenue sur Hub</h1>
      <button onClick={() => navigate("/")}>Retour à l'Accueil</button>
    </div>
  );
};

export default Hub;
