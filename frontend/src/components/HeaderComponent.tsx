import React from "react";
import useNavigation from "../hooks/useNavigation";
import { useProfileContext } from "../context/ProfilContext";
import { User } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import VsButton from "./Vs/VsButton";

const Header = () => {
  const { navigate } = useNavigation();
  const { profileImage } = useProfileContext();
  const { t } = useTranslation();

  return (
    <div>
      <div className="w-3/5 h-22 mx-auto mt-4 py-3 px-6 bg-gray-800 rounded-[20px] border-2 border-gray-600 shadow-lg text-white">
        {/* Profile */}
        <div
          className="absolute start-0 top-70 left-60 w-20 h-20 rounded-full cursor-pointer border border-gray-300 bg-gray-700 flex items-center justify-center overflow-hidden z-20"
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
          <button className="button-header px-7 py-1 text-black rounded hover:bg-gray-300 transition">
            {t("Multijoueur")}
          </button>
          <button className="button-header px-7 py-1 text-black rounded hover:bg-gray-300 transition">
            {t("Tournois")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;