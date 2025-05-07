import useNavigation from "../hooks/useNavigation";
import { useProfileContext } from "../context/ProfilContext";
import { User } from "lucide-react";
import VsButton from "./Vs/VsButton";
import MultiButton from "./Multi/MultiButton";
import { useEffect } from "react";
import TournamentButton from "./Tournament/TournamentButton"

const Header = () => {
  const { navigate } = useNavigation();
  const { profileImage, refreshProfile } = useProfileContext();

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
          <TournamentButton/>
        </div>
    </div>
  );
};

export default Header;