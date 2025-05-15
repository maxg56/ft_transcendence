import React, {useState } from "react";
import { useTranslation , Language } from "@/context/TranslationContext";
import { useConfKey, ConfKeyMap } from "@/context/ConfKeyContext";
import KeyInput from "./KeyComponent";
import { DoubleAuthentification } from "./DoubelAuthen";
import { useModifProfilApi } from "@/hooks/api/profile/useApiModifProfil";
import { Username } from "./type/profilInterface";
import { SettingsPageProps } from "./type/profilInterface";
import { ConfirmPasswordModal } from "./Settings/ConfirmPassword";
import { Card } from "../ui/card";
import { toast } from "sonner";

const SettingsPage: React.FC<SettingsPageProps> = ({ onUsernameChange }) => {
	const { t, changeLanguage } = useTranslation();
	const [username, setUsername] = useState<string>("");
	const { confKey, changeKey } = useConfKey();
	const [confirmPassword, setConfirmPassword] = useState<boolean>(false);

	const { modifProfil } = useModifProfilApi();

	const handleUserUpdate = async () => {
		const nameLength = username.trim().length;
		if (nameLength < 3 || nameLength > 20) {
			toast.error(t("Le nom d'utilisateur doit contenir entre 3 et 20 caractères"));
			return;
		}
		const updatedUser: Username = { username };
		await modifProfil.refetch(updatedUser);
		onUsernameChange?.(username);
	};
		

	const isKeyUsed = (currentKey: keyof ConfKeyMap, newKey: string) => {
	return (
		newKey !== "" &&
		Object.entries(confKey).some(([k, v]) => k !== currentKey && v === newKey)
	);
	};

	const handleKeyChange = (keyName: keyof ConfKeyMap, newKey: string) => {
		if (!isKeyUsed(keyName, newKey)) {
		  changeKey(keyName, newKey);
		}
	};

	return (
		<div>
			<div className="flex flex-col gap-[20px]">
			<Card className="w-[70%] h-[40%] mx-auto my-auto p-1 rounded-2xl border border-cyan-300/30 
							bg-gradient-to-br from-cyan-400/10 to-transparent 
  							backdrop-blur-md shadow-[inset_0_0_20px_rgba(0,255,255,0.1),0_0_20px_rgba(0,255,255,0.15)] 
  							transition duration-300 text-black"
							>
  				<div className="flex flex-col items-center justify-center gap-1">
    				<h2 className=" text-xxl font-semibold text-cyan-200 tracking-wide">{t("Langue")}</h2>
    					<div className="flex flex-row gap-[120px] mt-2">
      						{["en", "fr", "pt", "kgt"].map((lang) => (
        					<button
          						key={lang}
          						className="px-6 py-3 w-32 text-center text-white font-semibold rounded-md 
            								bg-gradient-to-r from-cyan-500/60 via-blue-600/60
            								backdrop-blur-sm border border-cyan-300/30 
            								hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition duration-300"
          						onClick={() => changeLanguage(lang as Language)}
        						>
          						{t(lang)}
        					</button>
      						))}
    					</div>
  				</div>
			</Card>

				<Card className="w-[70%] h-[40%] mx-auto my-auto p-0 rounded-2xl border border-cyan-300/30 
								bg-gradient-to-br from-cyan-400/10 via-purple-500/10 to-transparent backdrop-blur-md 
  								shadow-[inset_0_0_20px_rgba(0,255,255,0.1),0_0_20px_rgba(0,255,255,0.15)] 
  								transition duration-300 text-cyan-200 ">
					<div className="m-1">
						<p className="text-center font-semibold">{t("Commandes")}</p>
						<div className="flex flex-row items-center justify-center gap-[250px] ">
							<div className="flex flex-col items-center gap-4 ">
								<p className="text-lg font-bold  text-white">P1</p>
								<div className="flex gap-10 ">
									<div className="flex flex-col items-center gap-1">
										<KeyInput value={confKey.p1_up} onChange={(key) => handleKeyChange("p1_up", key)} />
										<p className="text-lg font-bold text-white ">{t("Up")}</p>
									</div>
									<div className="flex flex-col items-center gap-1">
										<KeyInput  value={confKey.p1_down} onChange={(key) => handleKeyChange("p1_down", key)} />
										<p className="text-lg font-bold text-white">{t("Down")}</p>
									</div>
								</div>
							</div>
							<div className="flex flex-col items-center gap-4 ">
								<p className="text-lg font-bold  text-white">P2</p>
								<div className="flex gap-10 ">
									<div className="flex flex-col items-center gap-1 ">
										<KeyInput  value={confKey.p2_up} onChange={(key) => handleKeyChange("p2_up", key)} />
										<p className="text-lg font-bold text-white ">{t("Up")}</p>
									</div>
									<div className="flex flex-col items-center gap-1">
										<KeyInput value={confKey.p2_down} onChange={(key) => handleKeyChange("p2_down", key)} />
										<p className="text-lg font-bold text-white">{t("Down")}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>


				<Card className="w-3/4 mx-auto my-auto w-[70%] h-[10%] mx-auto my-auto p-0 rounded-2xl border border-cyan-300/30 
								bg-gradient-to-br from-cyan-400/10 via-purple-500/10 backdrop-blur-md 
  								shadow-[inset_0_0_20px_rgba(0,255,255,0.1),0_0_20px_rgba(0,255,255,0.15)] 
  								transition duration-300 text-cyan-200 gap-[10px]">
					<div className="flex flex-col items-center justify-center gap-3 m-2">
						<h2 >{t("Modifier")}</h2>

						<div className="flex flex-row items-center justify-center gap-[20px]">
							<div className="flex items-center gap-4 ">
								<input
									type="text"
									placeholder={t("Nom d'utilisateur")}
									value={username}
									onChange={(e) =>setUsername(e.target.value)}
									className="w-[250px] px-2 py-2 rounded-md bg-white/10 border border-cyan-300/20 text-white text-xl placeholder-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
								/>
								<button
									onClick={handleUserUpdate}
									className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
								>
									{t("Modifier")}
								</button>
							</div>

							<div className="flex items-center">
								<button
									onClick={() => setConfirmPassword(true)}
									className="px-2 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
								>
									{t("Modifier Mot de Passe")}
								</button>

								{confirmPassword && (
									<ConfirmPasswordModal
										onClose={() => setConfirmPassword(false)}
									/>
								)}
							</div>
						</div>
					</div>
				</Card>

				<Card className="w-[70%] h-[90px] mx-auto my-auto p-0 rounded-2xl border border-cyan-300/30 
								bg-gradient-to-br from-cyan-400/10 via-purple-500/10 to-transparent backdrop-blur-md 
  								shadow-[inset_0_0_20px_rgba(0,255,255,0.1),0_0_20px_rgba(0,255,255,0.15)] 
  								transition duration-300 text-cyan-200 ">
					<div className="flex flex-col gap-6 m-3 items-center justify-center h-[50px] m-1">
						<div className="flex flex-col gap-4 items-center justify-center">
							{t("Double Authentification")}
							<DoubleAuthentification />
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default SettingsPage;
