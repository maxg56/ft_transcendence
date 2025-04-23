import React, {useState} from "react" 
import { useTranslation } from "../context/TranslationContext";
import { useConfKey } from "../context/ConfKeyContext";

const SettingsPage: React.FC = () => {
  	const { t, changeLanguage } = useTranslation();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState(""); 
	const [mail, setMail] = useState(""); 
	const { confKey, changeKey } = useConfKey();

	const handleUserUpdate = () => {
		console.log("New userName: ", username);
	}

	const handlePasswordUpdate = () => {
		console.log("New Password: ", password);
	}

	const handleMailUpdate = () => {
		console.log("New Mail: ", mail);
	}
  return (
    <>
		<div className="flex flex-col gap-[100px]">
			<div className="flex flex-row gap-3">
				{t("Langue")}
				<button className="px-4 py-2 bg-blue-300 text-black rounded hover:bg-gray-200 w-full"
						onClick={() => changeLanguage("en")}>
					English
				</button>
				<button className="px-4 py-2 bg-blue-300 text-black rounded hover:bg-gray-200 w-full"
						onClick={() => changeLanguage("fr")}>
					Français
				</button>
				<button className="px-4 py-2 bg-blue-300 text-black rounded hover:bg-gray-200 w-full"
						onClick={() => changeLanguage("pt")}>
					Portugais
				</button>
				<button className="px-4 py-2 bg-blue-300 text-black rounded hover:bg-gray-200 w-full"
						onClick={() => changeLanguage("kgt")}>
					Klingon
				</button>
			</div>
			<div>
				<div className="flex flex-row gap-[100px]">
					{t("Commandes")}

						<div className="flex space-x-4">
							<div className="border border-gray-400 px-4 py-1 rounded bg-gray-100 w-12 text-center">
								{confKey.p1_up.toUpperCase()}
							</div>
							<div className="border border-gray-400 px-4 py-1 rounded bg-gray-100 w-12 text-center">
								{confKey.p1_down.toUpperCase()}
							</div>
						</div>
						<div className="font-bold text-center">{t("Nouvelles touches")}</div>
						<div className="flex space-x-4">
							<input
								type="text"
								maxLength={1}
								className="w-12 text-center border border-gray-400 px-2 py-1 rounded bg-white text-xs"
								placeholder="_"
								onChange={(e) => changeKey("p1_up", e.target.value)}
							/>
							<input
								type="text"
								maxLength={1}
								className="w-12 text-center border border-gray-400 px-2 py-1 rounded bg-white text-xs"
								placeholder="_"
								onChange={(e) => changeKey("p1_down", e.target.value)}
							/>
						</div>
						<button className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
							{t("Enregistrer")}
						</button>
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
					className="w-[250px] px-2 py-2 border border-gray-300 rounded-md text-xs"
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
				<div className="flex flex-row gap-3">
					Double Authentification
				</div>
			</div>
		</div>
    </>
  );
};

export default SettingsPage;