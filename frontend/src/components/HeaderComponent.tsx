import React from "react";
import useNavigation from "../hooks/useNavigation";
import { useProfileContext } from "../context/ProfilContext";
import SettingsModal from "./SettingsModal";

const Header: React.FC = () => {
  const { navigate } = useNavigation();
  const { profileImage } = useProfileContext();
  return (
    // <header className="bg-orange-300 p-9 text-white flex justify-between items-center relative">
    //   {/* Image de profil cliquable */}
    //   <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
    //     <img
    //       src={profileImage || "/default-profile.png"}
    //       alt="Profile"
    //       className="w-12 h-12 rounded-full cursor-pointer border border-gray-300"
    //       onClick={() => navigate("/profile")}
    //     />
    //   </div>
    //   {/* Bouton Paramètres */}
    //   <SettingsModal />
    // </header>

    <header className=" scale-95 ">
      {/* <Scene/> */}
      <div className="w-screen h-screen rounded-[150px] padding-[10px] overflow-hidden bg-gray-900 flex flex-col">
      <img
          src={profileImage || "/default-profile.png"}
          alt="Profile"
          className="w-12 h-12 rounded-full cursor-pointer border border-gray-300"
          onClick={() => navigate("/profile")}
        />
      </div>
      {/* Bouton Paramètres */}
      <SettingsModal />
      </header>
  );
};

export default Header;
