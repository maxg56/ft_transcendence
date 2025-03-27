import React from "react";
import { useProfileContext } from "../context/ProfilContext";
import useNavigation from "../hooks/useNavigation";

const Profile: React.FC = () => {
  const { profileImage, setProfileImage } = useProfileContext();
  const { navigate } = useNavigation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newImage = URL.createObjectURL(e.target.files[0]); // Génère un URL temporaire
      setProfileImage(newImage); // Met à jour l’image dans le contexte
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Page de Profil</h2>

      {/* Image de profil modifiable */}
      <img
        src={profileImage || "/default-profile.png"}
        alt="Profile"
        className="w-32 h-32 rounded-full border border-gray-300"
      />

      <input
        type="file"
        onChange={handleImageChange}
        className="mt-4 border p-2"
      />

	<button className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200"
			onClick={() => navigate("/hub")}
			>
		Back to Hub
	</button>
    </div>
  );
};

export default Profile;
