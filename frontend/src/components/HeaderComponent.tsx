
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
        {/* Profile */}
        <div
          className="neon-button-profil absolute top-[10%] left-1/2 top-70 left-40 w-20 h-20 rounded-full cursor-pointer border border-gray-300 bg-gray-700 flex items-center justify-center overflow-hidden"
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
        <div className="absolute top-[10%] left-[55%] -translate-x-1/2 flex items-center justify-between gap-4">
          <VsButton />
          <MultiButton />
          <button
  className="text-glow px-40 py-2 rounded-md text-white font-semibold 
             bg-gradient-to-r from-cyan-400/60 via-blue-500/60 to-purple-600/60 
             backdrop-blur-md 
             shadow-[0_0_20px_rgba(0,255,255,0.4)] 
             hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] 
             border border-cyan-300/30 
             transition duration-300"
>
  {t("Tournois")}
</button>
        </div>
    </div>
  );
};

export default Header;