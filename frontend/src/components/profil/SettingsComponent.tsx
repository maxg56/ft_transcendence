import React, { useEffect, useState } from "react";
import { useTranslation } from "@/context/TranslationContext";
import { useConfKey } from "@/context/ConfKeyContext";
import KeyInput from "./KeyComponent";
import { DoubleAuthentification } from "./DoubelAuthen";
import { useModifProfilApi } from "@/hooks/api/profile/useApiModifProfil";
import { Username } from "./type/profilInterface";
import { SettingsPageProps } from "./type/profilInterface";
import { ConfirmPasswordModal } from "./Settings/ConfirmPassword";
import { Card } from "../ui/card";
const SettingsPage: React.FC<SettingsPageProps> = ({ onUsernameChange }) => {
	const { t, changeLanguage } = useTranslation();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { confKey, changeKey } = useConfKey();
	const [confirmPassword, setConfirmPassword] = useState(false);

	const {modifProfil} = useModifProfilApi();

	const handleUserUpdate = async () => {
		const updatedUser: Username = {
			username: username,
		}
		await modifProfil.refetch(updatedUser);
		onUsernameChange?.(username);
	};

	const handlePasswordUpdate = () => {
		console.log("New Password: ", password);
	};

	const isKeyUsed = (currentKey: string, newKey: string) => {
		return (
			newKey !== "" &&
			Object.entries(confKey).some(
				([k, v]) => k !== currentKey && v === newKey
			)
		);
	};

	const handleKeyChange = (keyName: string, newKey: string) => {
		if (!isKeyUsed(keyName, newKey)) {
			changeKey(keyName, newKey);
		}
	};

	return (
		<div>
			<div className="flex flex-col gap-[20px]">
				<Card>
					<div className="flex flex-col items-center justify-center gap-3 m-2">
						<h2 className="	font-semibold">{t("Langue")}</h2>
						<div className="flex flex-row gap-[150px] m-3 items-center justify-center">
						{["en", "fr", "pt", "kgt"].map((lang) => (
							<button
							key={lang}
							className="bg-blue-300 text-black rounded-2xl hover:bg-gray-200 px-6 py-3 w-32 text-center"
							onClick={() => changeLanguage(lang)}
							>
							{t(lang)}
							</button>
						))}
						</div>
					</div>
				</Card>
				<Card>
					<div className="m-2">
						<p className="text-center font-semibold">{t("Commandes")}</p>
						<div className="flex flex-row items-center justify-center gap-[250px]">
							<div className="flex flex-col items-center gap-4">
								<p className="text-lg font-bold text-gray-700">P1</p>
								<div className="flex gap-10 ">
									<div className="flex flex-col items-center gap-1">
										<KeyInput keyName="p1_up" value={confKey.p1_up} onChange={(key) => handleKeyChange("p1_up", key)} />
										<p className="text-lg font-bold text-gray-700">Up</p>
									</div>
									<div className="flex flex-col items-center gap-1">
										<KeyInput keyName="p1_down" value={confKey.p1_down} onChange={(key) => handleKeyChange("p1_down", key)} />
										<p className="text-lg font-bold text-gray-700">Down</p>
									</div>
								</div>
							</div>
							<div className="flex flex-col items-center gap-4">
								<p className="text-lg font-bold text-gray-700">P2</p>
								<div className="flex gap-10">
									<div className="flex flex-col items-center gap-1">
										<KeyInput keyName="p2_up" value={confKey.p2_up} onChange={(key) => handleKeyChange("p2_up", key)} />
										<p className="text-lg font-bold text-gray-700">Up</p>
									</div>
									<div className="flex flex-col items-center gap-1">
										<KeyInput keyName="p2_down" value={confKey.p2_down} onChange={(key) => handleKeyChange("p2_down", key)} />
										<p className="text-lg font-bold text-gray-700">Down</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>


				<Card>
					<div className="flex flex-col items-center justify-center gap-3 m-2">
						<h2 >{t("Modifier")}</h2>

						<div className="flex flex-row items-center justify-center gap-24">
							<div className="flex items-center gap-4">
								<input
									type="text"
									placeholder={t("Nom d'utilisateur")}
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									className="w-[250px] px-2 py-2 border border-gray-300 rounded-md text-xl"
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
										passwordToMatch={password}
										onConfirm={handlePasswordUpdate}
										onClose={() => setConfirmPassword(false)}
									/>
								)}
							</div>
						</div>
					</div>
				</Card>

				<Card>
					<div className="flex flex-col gap-6 m-3 items-center justify-center h-[120px] m-1">
						<div className="flex flex-col gap-4 items-center justify-center">
							Double Authentification
							<DoubleAuthentification />
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default SettingsPage;
