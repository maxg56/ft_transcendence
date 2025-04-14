import React from "react";
import useNavigation from "../hooks/useNavigation";
import { useProfileContext } from "../context/ProfilContext";
import SettingsModal from "./SettingsModal";

// const Header: React.FC = () => {
//   const { navigate } = useNavigation();
//   const { profileImage } = useProfileContext();
//   return (
// <div className="w-3/5 mx-auto mt-4 py-3 px-6 bg-gray-800 rounded-[20px] border-2 border-gray-600 shadow-lg text-white">
// <div className="flex items-center justify-between">
//   {/* Profile */}
//   <img
//     src={profileImage || "/default-profile.png"}
//     alt="Profile"
//     className="w-12 h-12 rounded-full cursor-pointer border border-gray-300"
//     onClick={() => navigate("/profile")}
//   />
//   {/* Title */}
//   <h1 className="text-xl font-bold text-center flex-1">
//     ft_transcendence
//   </h1>

//   {/* Settings */}
//   <div className="flex-shrink-0">
//     <SettingsModal />
//   </div>
// </div>
// </div>
//   );
// };

// export default Header;


const Header: React.FC = () => {
  const { navigate } = useNavigation();
  const { profileImage } = useProfileContext();

  return (
    <div className="w-3/5 mx-auto mt-4 py-3 px-6 bg-gray-800 rounded-[20px] border-2 border-gray-600 shadow-lg text-white">
      <div className="flex items-center justify-between">
        {/* Profile */}

        <img
          src={profileImage || "/default-profile.png"}
          alt="Profile"
          className="w-25 h-12 rounded-full cursor-pointer border border-gray-300"
          onClick={() => navigate("/profile")}
        />
        {/* Title */}
        {/* <h1 > */}
        
        {/* <h1 className="text-5xl font-extrabold text-center flex-1 text-blue-800 neonText"> */}
        <h1 className="neonText text-5xl text-blue-100">
          ft_transcendence
        </h1>

        {/* Settings */}
        <div className="flex-shrink-0 ">
          <SettingsModal />
        </div>
      </div>
    </div>
  );
};

export default Header;