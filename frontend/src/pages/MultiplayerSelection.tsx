import React from "react";
import useNavigation from "../hooks/useNavigation";
import { useTranslation } from "../context/TranslationContext";
import Header from "../components/HeaderComponent";


const MultiplayerSelection: React.FC = () => {
	const {t} = useTranslation();
	const {navigate} = useNavigation();

	return(
		<div>
			<Header/>
			<button className="px-4 py-3 bg-orange-300 text-black text-lg text-3xl rounded hover:bg-gray-200"
					onClick={() => navigate("/hub")}>
					{t("Retour au menu")}
			</button>
			<div className="flex flex-col items-center justify-center h-[670px]">
				<div className="flex space-x-8 mb-8">
					<button className="px-[50px] py-3 bg-orange-300 text-black text-lg text-3xl rounded hover:bg-gray-200"
						onClick={() => navigate("/")}>
						{t("4 Joueurs")}
					</button>
					<button className="px-[50px] py-3 bg-orange-300 text-black text-3xl rounded hover:bg-gray-200"
						onClick={() => navigate("/")}>
						{t("3 Joueurs")}
					</button>
				</div>
				<button className="px-[50px] py-3 bg-orange-300 text-black text-3xl rounded hover:bg-gray-200"
						onClick={() => navigate("/")}>
						{t("Tournoi")}
				</button>
			</div>
		</div>
	);
};

export default MultiplayerSelection;