import React, { useState } from "react";
import { useTranslation } from "@/context/TranslationContext";
import { useConfKey } from "@/context/ConfKeyContext";
import KeyInput from "./KeyComponent";
import { DoubleAuthentification } from "./DoubelAuthen";

const SettingsPage: React.FC = () => {
	const { t, changeLanguage } = useTranslation();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [mail, setMail] = useState("");
	const { confKey, changeKey } = useConfKey();

	const handleUserUpdate = () => {
		console.log("New userName: ", username);
	};

	const handlePasswordUpdate = () => {
		console.log("New Password: ", password);
	};

	const handleMailUpdate = () => {
		console.log("New Mail: ", mail);
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
		<div className="flex flex-col gap-[100px]">
			<div className="flex flex-row gap-3">
				{t("Langue")}
				{["en", "fr", "pt", "kgt"].map((lang) => (
					<button
						key={lang}
						className="px-4 py-2 bg-blue-300 text-black rounded hover:bg-gray-200 w-full"
						onClick={() => changeLanguage(lang)}
					>
						{t(lang)}
					</button>
				))}
			</div>

			<div>
				<div className="flex flex-row gap-[100px]">
					<p className="text-center font-semibold">{t("Commandes")}</p>
					<div className="flex flex-col items-center space-y-1">
					<p className="text-lg font-bold text-gray-700">P1</p>
					<div className="flex space-x-10">
						<div className="flex flex-col items-center space-y-1">
							<KeyInput keyName="p1_up" value={confKey.p1_up} onChange={(key) => handleKeyChange("p1_up", key)} />
							<p className="text-lg font-bold text-gray-700">Up</p>
						</div>
						<div className="flex flex-col items-center space-y-1">
							<KeyInput keyName="p1_down" value={confKey.p1_down} onChange={(key) => handleKeyChange("p1_down", key)} />
							<p className="text-lg font-bold text-gray-700">Down</p>
						</div>
					</div>
				</div>

				<div className="flex flex-col items-center space-y-100px">
					<p className="text-lg font-bold text-gray-700">P2</p>
					<div className="flex space-x-10">
						<div className="flex flex-col items-center space-y-1">
							<KeyInput keyName="p2_up" value={confKey.p2_up} onChange={(key) => handleKeyChange("p2_up", key)} />
							<p className="text-lg font-bold text-gray-700">Up</p>
						</div>
						<div className="flex flex-col items-center space-y-1">
							<KeyInput keyName="p2_down" value={confKey.p2_down} onChange={(key) => handleKeyChange("p2_down", key)} />
							<p className="text-lg font-bold text-gray-700">Down</p>
						</div>
					</div>
				</div>
				</div>
			</div>

			<div className="flex flex-row gap-[100px]">
				{t("Modifier")}
				<div className="flex items-center">
					<input
						type="text"
						placeholder={t("Nom d'utilisateur")}
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="w-[250px] px-2 py-2 border border-gray-300 rounded-md text-xl"
					/>
					<button
						onClick={handleUserUpdate}
						className="px-3 py-2 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
					>
						{t("Modifier")}
					</button>
				</div>

				<div className="flex items-center">
					<input
						type="password"
						placeholder={t("Mot de passe")}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-[250px] px-2 py-2 border border-gray-300 rounded-md text-xs"
					/>
					<button
						onClick={handlePasswordUpdate}
						className="px-3 py-2 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
					>
						{t("Modifier")}
					</button>
				</div>

				<div className="flex items-center">
					<input
						type="email"
						placeholder="Email"
						value={mail}
						onChange={(e) => setMail(e.target.value)}
						className="w-[250px] px-2 py-2 border border-gray-300 rounded-md text-xs"
					/>
					<button
						onClick={handleMailUpdate}
						className="px-3 py-2 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
					>
						{t("Modifier")}
					</button>
				</div>
			</div>

			<div>
				<div className="flex flex-row gap-[230px]">Double Authentification<DoubleAuthentification/></div>
			</div>
		</div>
	);
};

export default SettingsPage;
