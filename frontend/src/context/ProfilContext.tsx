// ProfileContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface ProfileContextType {
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profileImage, setProfileImageState] = useState<string | null>(() => {
    return localStorage.getItem("profileImage");
  });

  const setProfileImage = useCallback((image: string | null) => {
    if (image) {
      localStorage.setItem("profileImage", image);
    } else {
      localStorage.removeItem("profileImage");
    }
    setProfileImageState(image);
  }, []);

  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage }}>
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
