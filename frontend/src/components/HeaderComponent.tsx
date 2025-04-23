import React from "react";
import useNavigation from "../hooks/useNavigation";
import { useProfileContext } from "../context/ProfilContext";
import { User } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";

function ButtonHead() {
  const { t } = useTranslation();

  return (
    <>
      <button
        className="button-header px-7 py-1 text-black rounded .button-header:hover"
        onClick={() => void(true)} >
        {t("VS")}
      </button>
      <button
        className="button-header px-7 py-1 text-black rounded .button-header:hover"
        onClick={() => void(true)}   >
        {t("Multijoueur")}
      </button>
      <button
        className="button-header px-7 py-1 text-black rounded .button-header:hover"
        onClick={() => void(true)} >
        {t("Tournois")}
      </button>
    </>
  );
}

const Header: React.FC = () => {
  const { navigate } = useNavigation();
  const { profileImage } = useProfileContext();
  return (
    <div>
    <div className="w-3/5 h-22 mx-auto mt-4 py-3 px-6 bg-gray-800 rounded-[20px] border-2 border-gray-600 shadow-lg text-white">
     {/* Profile */}
    <div
          className="absolute start-0 top-10 left-40 w-20 h-20 rounded-full cursor-pointer border border-gray-300 bg-gray-700 flex items-center justify-center overflow-hidden z-20"
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
        <div className="flex items-center justify-between">
          <ButtonHead/>
        </div>
    </div>
    </div>
  );
};

export default Header;
