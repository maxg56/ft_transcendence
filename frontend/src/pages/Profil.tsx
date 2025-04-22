import React, { useRef, useState } from "react";
import { useProfileContext } from "../context/ProfilContext";
import useNavigation from "../hooks/useNavigation";
import { User } from "lucide-react";

type Options = "Amis" | "Settings" | "Stats Pong" | "Stats Shifumi"

const Profile: React.FC = () => {
  const { profileImage, setProfileImage } = useProfileContext();
  const { navigate } = useNavigation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectOptions, setSelectedOption] = useState<Options>("Amis");


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  const username = "User";
  const rank = "Diamant";
  return (
    <div className="p-8 flex flex-col space-y-8 min-h-screen text-white">
  
      {/* En-tête : ligne avec PP, username à gauche et rank à droite */}
      <div className="flex items-start justify-between mb-8">
  
        {/* Partie gauche : PP + username + bouton supprimer */}
        <div className="flex items-start space-x-6">
          {/* Photo de profil */}
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={triggerFileSelect}
            >
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-gray-500" />
              )}
            </div>
  
            {profileImage && (
              <button
                className="text-sm text-red-400 hover:underline mt-2"
                onClick={handleRemoveImage}
              >
                Supprimer la photo
              </button>
            )}
          </div>
  
          <div className="flex flex-col justify-center">
            <span className="text-2xl font-semibold">{username}</span>
          </div>
        </div>
  
        <div className="flex items-start space-x-6">
          <span className="text-lg text-gray-300 mt-2">{rank}</span>
        </div>
  
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
      </div>
  
      <div className="flex flex-1 gap-4 w-full max-w-8xl">
        {/* Menu gauche */}
        <nav className="w-64 bg-gray-200 p-4 rounded-md flex flex-col space-y-14 text-black">
          {(["Amis", "Settings", "Stats Pong", "Stats Shifumi"] as Options[]).map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedOption(opt)}
              className={`text-left px-3 py-2 rounded transition ${
                selectOptions === opt ? "font-bold bg-gray-300" : "hover:bg-gray-300"
              }`}
            >
              {opt}
            </button>
          ))}
           <button
            onClick={() => navigate("/hub")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return Hub
          </button>
        </nav>
  
        {/* Contenu droit */}
        <div className="flex-1 bg-gray-100 p-6 rounded-md text-black">
          {selectOptions === "Amis" && (
            <div>
              <h3 className="font-bold mb-2">Liste d’amis</h3>
            </div>
          )}
          {selectOptions === "Settings" && (
            <div>
              <h3 className="font-bold mb-2">Parametres</h3>
            </div>
          )}
          {selectOptions === "Stats Pong" && (
            <div>
              <h3 className="font-bold mb-2">Stats Pong</h3>
            </div>
          )}
          {selectOptions === "Stats Shifumi" && (
            <div>
              <h3 className="font-bold mb-2">Stats Shifumi</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  ); 
};

export default Profile;
