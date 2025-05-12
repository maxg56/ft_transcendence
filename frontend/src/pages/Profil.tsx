import React, { useEffect, useRef, useState } from "react";
import { useProfileContext } from "../context/ProfilContext";
import useNavigation from "../hooks/useNavigation";
import { useTranslation } from "../context/TranslationContext";
import FriendsPanel from "../components/profil/Friends/FriendsComponent";
import SettingsPage from "../components/profil/SettingsComponent";
import StatsPong from "@/components/profil/stats/StatsPongComponent";
import LogoutButton from "@/components/profil/LogOutComponent";
import { useApi } from "@/hooks/api/useApi";
import { Elos, UserInfos } from "@/components/profil/type/profilInterface";
import DeleteAccountModal from "@/components/profil/SuppresAccountModal";
import StarsBackground from "@/animation/StarsBackground";

type Options = "friends" | "settings" | "pong" ;

const Profile: React.FC = () => {
	const { profileImage, setProfileImage, setUserId, refreshProfile } = useProfileContext();
	const { navigate } = useNavigation();
	const { t } = useTranslation();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectOptions, setSelectedOption] = useState<Options>("friends");
	const [username, setUser] = useState("");
	const [elo, setElo] = useState(0);


	const labelMap: Record<Options, string> = {
		friends: t("Amis"),
		settings: t("Options"),
		pong: t("Stats Pong"),
	};

	const { refetch: fetchUploadAvatar } = useApi<any>(
		"/user/avatar/upload",
		{
			method: 'PUT',
			immediate: false,
			onSuccess: (data) => {
				if (!data ) {
					console.error("Erreur avatar upload: réponse invalide", data)
					return
				}
			},
			onError: (errMsg) => {
				console.error('Erreur avatar upload :', errMsg)
			},
		}
	)

	const { refetch: fetchDeleteAvatar } = useApi<any>(
		"/user/avatar/delete",
		{
			method: 'DELETE',
			immediate: false,
			onSuccess: (data) => {
				if (!data ) {
					console.error("Erreur avatar delete: réponse invalide", data)
					return
				}
			},
			onError: (errMsg) => {
				console.error('Erreur avatar delete :', errMsg)
			},
		}
	)

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64 = reader.result as string;
				setProfileImage(base64);
				fetchUploadAvatar({ image: base64 });
			};
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	const triggerFileSelect = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleRemoveImage = async () => {
		await fetchDeleteAvatar({});
			setProfileImage(null);
			refreshProfile();
	};

	const { refetch: fetchElo} = useApi<Elos>(
		"/user/elo",
		{
			immediate: false,
			onSuccess: (data) => {
				if (!data ) {
					console.error("Erreur Elo : réponse invalide", data)
					return
				}
				setElo(data.elo)
			},
			onError: (errMsg) => {
				console.error('Erreur Elo :', errMsg)
			},
		}
	)

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
				setUser(data.username);
				setProfileImage(data.avatar)
			},
			onError: (errMsg) => {
				console.error('Erreur User :', errMsg)
			},
		}
	)

	useEffect(() => {
		const fetchData = async () => {
			await Promise.all([fetchElo(),
				fetchUserInfos(),
			]);
			refreshProfile();
		};
		fetchData();
	}, []
	);

	
	return (
		<div className="scale-95">
		  <div className="crt w-screen h-screen rounded-[150px] overflow-hidden bg-gray-900 relative">
		  <StarsBackground/>
			{/* Glow Layer */}
			<div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
			  <div className="w-full h-full absolute top-[-100%] scanline-glow" />
			</div>
	  
			{/* Top Profile Info */}
			<div className="relative z-10 flex justify-between items-center px-20 py-10">
			  {/* Profile Section */}
			  <div className="flex items-center space-x-12">
				{/* Avatar */}
				<div className="flex flex-col items-center">
				  <div
					className="w-32 h-32 rounded-full 
							   bg-gradient-to-br from-cyan-400/60 via-blue-500/60 to-purple-600/10 
							   border border-cyan-300/30 to-transparent
							   backdrop-blur-md 
							   shadow-[0_0_20px_rgba(0,255,255,0.4)] 
							   hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] 
							   transition duration-300 
							   overflow-hidden cursor-pointer"
					onClick={triggerFileSelect}
				  >
					{profileImage ? (
					  <img
						src={profileImage}
						alt="Profile"
						className="w-full h-full object-cover"
					  />
					) : (
						<img
						src={`https://robohash.org/${username}`}
						alt={username}
						className="w-full h-full object-cover"
					/>
					)}
				  </div>
	  
				  {profileImage && (
					<button
					  className="mt-2 text-sm text-red-400 hover:underline"
					  onClick={handleRemoveImage}
					>
					  Supprimer la photo
					</button>
				  )}
				</div>
	  
				{/* Username */}
				<div className="flex flex-col justify-center">
				  <h1 className="text-glow text-4xl font-bold text-white tracking-wide drop-shadow-md">
					{username}
				  </h1>
				</div>
			  </div>
	  
			  {/* Rank & Elo */}
			  <div className="flex flex-col space-y-4">
				{/* <div
				  className="text-glow px-10 py-2 rounded-md text-white font-semibold 
							 bg-gradient-to-r from-cyan-400/60 via-blue-500/60 to-purple-600/10 
							 backdrop-blur-md 
							 shadow-[0_0_20px_rgba(0,255,255,0.4)] 
							 hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] 
							 border border-cyan-300/30 
							 transition duration-300"
				>
				  Rank: <span className="text-yellow-300">{rank}</span>
				</div> */}
				<div
				  className="text-glow px-10 py-2 rounded-md text-white font-semibold 
							 bg-gradient-to-r from-cyan-400/60 via-blue-500/60 to-purple-600/10 
							 backdrop-blur-md 
							 shadow-[0_0_20px_rgba(0,255,255,0.4)] 
							 hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] 
							 border border-cyan-300/30 
							 transition duration-300"
				>
				  Elo: <span className="text-green-300">{elo}</span>
				</div>
			  </div>
	  
			  <input
				type="file"
				ref={fileInputRef}
				onChange={handleImageChange}
				accept="image/*"
				className="hidden"
			  />
			</div>
	  
			{/* Main Content */}
			<div className="relative z-10 flex h-[70%] gap-4 px-8">
			  {/* Sidebar */}
			  <nav
				className="w-72 p-6 rounded-2xl text-white bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-purple-600/10 
						   backdrop-blur-md border border-cyan-300/30 
						   shadow-[0_0_20px_rgba(0,255,255,0.3)] flex flex-col justify-between"
			  >
				<div className="space-y-8 text-3xl">
				  {(["friends", "settings", "pong"] as Options[]).map((opt) => (
					<button
					  key={opt}
					  onClick={() => setSelectedOption(opt)}
					  className={`w-full text-left px-4 py-2 rounded-xl transition ${
						selectOptions === opt
						  ? "bg-white/10 font-bold text-cyan-300 shadow-inner"
						  : "hover:bg-white/10 text-white/80"
					  }`}
					>
					  {labelMap[opt]}
					</button>
				  ))}
				</div>
	  
				<div className="space-y-3 text-lg">
				  <button
					onClick={() => navigate("/hub")}
					className="w-full px-4 py-2 rounded-xl text-white font-semibold 
							   bg-gradient-to-r from-blue-500/60 to-purple-600/10 
							   hover:from-blue-600 hover:to-purple-700 
							   transition shadow-md border border-blue-300/30"
				  >
					Return Hub
				  </button>
				  <LogoutButton />
				  <DeleteAccountModal />
				</div>
			  </nav>
	  
			  <div className="flex-1 relative p-6 rounded-2xlrounded-md text-white font-semibold 
                        bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-200/20 
                        backdrop-blur-md
                        shadow-[0_0_20px_rgba(0,255,255,0.4)] 
                        hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] 
                        border border-cyan-300/30 
                        transition duration-300"
>

  {/* Panel content */}
  <div className="relative z-10">
    {selectOptions === "friends" && <FriendsPanel />}
    {selectOptions === "settings" && <SettingsPage onUsernameChange={setUser} />}
    {selectOptions === "pong" && <StatsPong />}
  </div>
</div>

			</div>
		  </div>
		</div>
	  );	  
};

export default Profile;
