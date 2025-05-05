import React, { useEffect, useRef, useState } from "react";
import { useProfileContext } from "../context/ProfilContext";
import useNavigation from "../hooks/useNavigation";
import { User } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import FriendsPanel from "../components/profil/Friends/FriendsComponent";
import SettingsPage from "../components/profil/SettingsComponent";
import StatsPong from "@/components/profil/stats/StatsPongComponent";
import LogoutButton from "@/components/profil/LogOutComponent";
import StatsShifumi from "@/components/profil/StatsShifumi";
import { useApi } from "@/hooks/api/useApi";
import { Username, Elos } from "@/components/profil/type/profilInterface";

type Options = "friends" | "settings" | "pong" | "shifumi";

const Profile: React.FC = () => {
	const { profileImage, setProfileImage } = useProfileContext();
	const { navigate } = useNavigation();
	const { t } = useTranslation();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectOptions, setSelectedOption] = useState<Options>("friends");
	const [username, setUser] = useState("");
	const rank = "Diamant";
	const [elo, setElo] = useState(0);

	const labelMap: Record<Options, string> = {
		friends: t("Amis"),
		settings: t("Options"),
		pong: t("Stats Pong"),
		shifumi: t("Stats Shifumi"),
	};

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

	const { refetch: fetchUsername } = useApi<Username>(
		"/user/info",
		{
			immediate: false,
			onSuccess: (data) => {
				if (!data ) {
					console.error("Erreur Username: réponse invalide", data)
					return
				}
				setUser(data.username)
			},
			onError: (errMsg) => {
				console.error('Erreur Username :', errMsg)
			},
		}
	)

	useEffect(() => {
		const fetchData = async () => {
			await Promise.all([fetchElo(), fetchUsername()]);
		};
		fetchData();
	}, []
	);

	
	return (
		<div className="p-4 flex flex-col space-y-2 min-h-screen text-white">
			<div className="flex items-start justify-between mb-8">
				<div className="flex items-start space-x-6">
					<div className="flex flex-col items-center">
						<div
							className="w-24 h-24 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer"
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

				<div className="flex flex-col items-start space-x-6 space-y-2 mr-[100px]">
					<span className="text-lg text-gray-300 mt-2">{rank}</span>
					<span className="text-lg text-gray-300 mt-2">{elo}</span>
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
				<nav className="w-64 bg-gray-200 p-4 rounded-md flex flex-col space-y-8 text-black">
					{(["friends", "settings", "pong", "shifumi"] as Options[]).map((opt) => (
						<button
							key={opt}
							onClick={() => setSelectedOption(opt)}
							className={`text-left px-3 py-2 rounded transition ${
								selectOptions === opt ? "font-bold bg-gray-300" : "hover:bg-gray-300"
							}`}
						>
							{labelMap[opt]}
						</button>
					))}
					<button
						onClick={() => navigate("/hub")}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						Return Hub
					</button>
					<LogoutButton/>
				</nav>

				<div className="flex-1 bg-gray-100 p-6 rounded-md text-black">
					{selectOptions === "friends" && <FriendsPanel />}
					{selectOptions === "settings" && <SettingsPage onUsernameChange={setUser} />}
					{selectOptions === "pong" && <StatsPong/>}
					{selectOptions === "shifumi" && <StatsShifumi/>}
				</div>
			</div>
		</div>
	);
};

export default Profile;
