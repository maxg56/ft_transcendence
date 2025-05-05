import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { UserInfos } from "@/components/profil/type/profilInterface";
import { useApi } from "@/hooks/api/useApi";

interface ProfileContextType {
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  userId: number | null;
  setUserId: (id: number | null) => void;
  refreshProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ userId: number; children: ReactNode }> = ({ children }) => {
  const [profileImage, setProfileImageState] = useState<string | null>(null)
  const [userId, setUserIdState] = useState<number | null>(null);

  const setProfileImage = useCallback((image: string | null) => {
    setProfileImageState(image);
  }, []);

  const setUserId = useCallback((id: number | null) => {
    setUserIdState(id);
    setProfileImageState(null);
  }, []);
  
  const { refetch: fetchUserInfos } = useApi<UserInfos>(
		"/user/info",
		{
			immediate: false,
			onSuccess: (data) => {
				if (!data ) {
					console.error("Erreur User: réponse invalide", data)
					return
				}
				setUserId(data.id);
				setProfileImage(data.avatar)
			},
			onError: (errMsg) => {
				console.error('Erreur User :', errMsg)
			},
		}
	)

  const refreshProfile = useCallback(() => {
		fetchUserInfos();
	}, [fetchUserInfos])


  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage, userId, setUserId, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
};
