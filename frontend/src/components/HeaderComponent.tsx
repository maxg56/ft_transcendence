
import useNavigation from "../hooks/useNavigation";
import { useProfileContext } from "../context/ProfilContext";
import { User } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import VsButton from "./Vs/VsButton";
import MultiButton from "./Multi/MultiButton";
import { useEffect } from "react";


const Header = () => {
  const { navigate } = useNavigation();
  const { profileImage, refreshProfile } = useProfileContext();
  const { t } = useTranslation();

  useEffect(() => {
      refreshProfile();
  }, []);

  return (
    <div>
      <div className="w-3/5 h-22 mx-auto mt-4 py-3 px-6 bg-gray-800 rounded-[20px] border-2 border-gray-600 shadow-lg text-white">
        {/* Profile */}
        <div
          className="absolute start-0 top-70 left-40 w-20 h-20 rounded-full cursor-pointer border border-gray-300 bg-gray-700 flex items-center justify-center overflow-hidden z-20"
          onClick={() => navigate("/profile")}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-white" />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <VsButton />
          <MultiButton />
          <button className=" neon-button bg-blue-500 px-7 py-1 text-black rounded hover:bg-gray-300 transition">
            {t("Tournois")}
          </button>
        </div>
      </div>
    </div>
  );
};

//   return (
//     <div className="scale-95">
//       <div>
//         <div className="crt w-screen h-screen rounded-[150px] padding-[10px] overflow-hidden bg-gray-900 flex flex-col">
//           {/* <Header /> */}
//           {/* CRT Scanline Sweep */}
//           <SpaceShipInterior/>
//           <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
//             <div className="w-full h-full absolute top-[-100%] scanline-glow" />
//           </div>
//           <div className="flex justify-center items-center w-full h-[839px] overflow-hidden">
//             {/* <App /> */}
//             <SpaceShipInterior/>
//             {/* <StarsBackground/> */}

//             {/* <button
//               className="absolute center neon-button px-20 py-10 bg-blue-300 text-black rounded hover:bg-gray-50"
//               onClick={handleStart}
//             >
//               {getStartText()}
//             </button> */}
// <button
//   className="absolute bottom-1/4 left-1/2 -translate-x-1/2 
//              px-20 py-10 rounded-md text-white font-semibold 
//              bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20 
//              backdrop-blur-md 
//              shadow-[0_0_20px_rgba(0,255,255,0.4)] 
//              hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] 
//              border border-cyan-300/30 
//              transition duration-300"
//   onClick={handleStart}
// >
//   {getStartText()}
// </button>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



export default Header;