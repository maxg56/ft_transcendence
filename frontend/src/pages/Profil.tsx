import React, { useRef, useState } from "react";
import { useProfileContext } from "../context/ProfilContext";
import useNavigation from "../hooks/useNavigation";
import { User } from "lucide-react";

const Profile: React.FC = () => {
  const { profileImage, setProfileImage } = useProfileContext();
  const { navigate } = useNavigation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleConfirm = () => {
    if (previewImage) {
      setProfileImage(previewImage);
      setPreviewImage(null);
    }
  };

  const handleCancel = () => {
    setPreviewImage(null);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  return (
    <div className="p-8 flex items-start justify-start h-full">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-2xl font-bold mb-2">Profil</h2>

        {/* Avatar cliquable */}
        <div
          className="w-32 h-32 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={triggerFileSelect}
        >
          {previewImage ? (
            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
          ) : profileImage ? (
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-gray-500" />
          )}
        </div>

        {/* Input file caché */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />

        {/* Boutons de gestion */}
        {previewImage && (
          <div className="flex space-x-4">
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Valider
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Annuler
            </button>
          </div>
        )}

        {profileImage && !previewImage && (
          <button
            onClick={handleRemoveImage}
            className="text-sm text-red-400 hover:underline mt-2"
          >
            Supprimer la photo
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
