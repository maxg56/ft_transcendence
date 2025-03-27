import React, { useState } from "react";
import { LogOut } from "lucide-react";
import  useNavigation  from "../hooks/useNavigation";

const LogOutWithConfirmation: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { navigate } = useNavigation();

  // Ouvre la modale
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Ferme la modale
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Confirmer la déconnexion
  const confirmLogOut = () => {
    navigate("/"); // Rediriger vers la page d'accueil 
    closeModal(); // Fermer la modale 
  };

  return (
    <>
      {/* Bouton Log Out */}
      <button 
        className="text-white hover:text-gray-200"
        onClick={openModal}
      >
        <LogOut size={32} />
      </button>

      {/* Modale de confirmation de déconnexion */}
	  {isModalOpen && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
      <h2 className="text-lg text-black font-bold mb-4">Êtes-vous sûr de vouloir vous déconnecter ?</h2>

      <div className="flex gap-4 justify-end">
        {/* Annuler */}
        <button 
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-200"
          onClick={closeModal}
        >
          Annuler
        </button>
        {/* Confirmer */}
        <button 
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={confirmLogOut}
        >
          Confirmer
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default LogOutWithConfirmation;

