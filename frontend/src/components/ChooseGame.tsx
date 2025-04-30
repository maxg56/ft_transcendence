import { useState } from "react";
import { useTranslation } from "../context/TranslationContext";
import { X } from "lucide-react";
import Header from "./HeaderComponent";
import useNavigation from "../hooks/useNavigation";
import { useSendWSMessage } from "../hooks/WedSooket/useSendWSMessage";


const Modeduel = () => {
  const { t } = useTranslation();
  const [isCreateGameOpen, setCreateGameOpen] = useState(false);
  const [isJoinGameOpen, setJoinGameOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const { navigate } = useNavigation();
  const send = useSendWSMessage();
  
  const handleJoinQueue = () => {

    send({ event: "join_queue"
        
     });
    navigate("/duel3");
  };

  const handleCreatePrivateGame = () => {
    send({
      event: "create_private_game",
      nb_players: 2,
    });
    setCreateGameOpen(false);
  };

  const handleJoinPrivateGame = () => {
    send({
      event: "join_private_game",
      gameCode: joinCode,
    });
    setJoinGameOpen(false);
  };

  return (

    <div>
      <Header />
      <button
        className="px-12 py-3 bg-orange-300 text-black text-3xl rounded hover:bg-gray-200"
        onClick={() => navigate("/hub")}
      >
        {t("Retour Hub")}
      </button>

      <div className="flex flex-col items-center justify-center h-[670px]">
        <div className="flex space-x-8 mb-8">
          <button
            className="px-12 py-3 bg-orange-300 text-black text-3xl rounded hover:bg-gray-200"
            onClick={() => navigate("/duel")}
          >
            {t("Local")}
          </button>

          <button
            className="px-12 py-3 bg-orange-300 text-black text-3xl rounded hover:bg-gray-200"
            onClick={() => setCreateGameOpen(true)}
          >
            {t("Creer une partie")}
          </button>

          <button
            className="px-12 py-3 bg-orange-300 text-black text-3xl rounded hover:bg-gray-200"
            onClick={() => setJoinGameOpen(true)}
          >
            {t("Rejoindre une partie")}
          </button>

          <button
            className="px-12 py-3 bg-orange-300 text-black text-3xl rounded hover:bg-gray-200"
            onClick={handleJoinQueue}
          >
            {t("Matchmaking")}
          </button>
        </div>
      </div>

      {/* Création partie privée */}
      {isCreateGameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-xl p-8 w-96">
            <button
              onClick={() => setCreateGameOpen(false)}
              className="absolute top-2 right-2 p-1 rounded hover:bg-gray-200"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">
              {t("Créer une partie privée")}
            </h2>
            <button
              onClick={handleCreatePrivateGame}
              className="w-full px-6 py-3 bg-green-500 text-white text-xl rounded hover:bg-green-600"
            >
              {t("Créer et jouer")}
            </button>
          </div>
        </div>
      )}

      {/* Rejoindre partie privée */}
      {isJoinGameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-xl p-8 w-96">
            <button
              onClick={() => setJoinGameOpen(false)}
              className="absolute top-2 right-2 p-1 rounded hover:bg-gray-200"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">
              {t("Rejoindre une partie")}
            </h2>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder={t("Entrez le code de la partie")}
              className="w-full px-4 py-2 border border-gray-300 rounded mb-6"
            />
            <button
              onClick={handleJoinPrivateGame}
              className="w-full px-6 py-3 bg-green-500 text-white text-xl rounded hover:bg-green-600"
            >
              {t("Rejoindre")}
            </button>
          </div>
        </div>
      )}
    </div>

  );
};

export default Modeduel;
