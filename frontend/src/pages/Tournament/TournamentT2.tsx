import { useWaitroomListener } from '@/hooks/WedSooket/userWsWR';
import NextMatch from '@/components/Tournament/NextMatch';
import React, { useState} from 'react';

import { toast } from 'sonner';

const TournamentT2: React.FC = () => {
  const { lastResults, matches, isHost, sendTournamentNextStep } = useWaitroomListener();
  const [loadingNextStep, setLoadingNextStep] = useState(false);

  // Handler pour le bouton host
  const handleNextStep = async () => {
    try {
      setLoadingNextStep(true);
      await sendTournamentNextStep();
      toast.success('Prochaine étape demandée au serveur.');
    } catch (e) {
      toast.error('Erreur lors de la demande de prochaine étape.');
    } finally {
      setLoadingNextStep(false);
    }
  };

  console.log("lastResults" , isHost);
  
  const finishedMatches = lastResults
  const upcomingMatches = matches
  // Affichage d'un match (résultat ou à venir)
  const renderMatch = (m: any, showResult = false) => (
    <NextMatch matchData={m} currentUser={""} showResult={showResult} />
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {isHost && (
        <div className="flex justify-center mb-6">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            onClick={handleNextStep}
            disabled={loadingNextStep}
          >
            {loadingNextStep ? 'Envoi...' : 'Lancer la prochaine étape'}
          </button>
        </div>
      )}
      <div className={`space-y-16`}>
        <section>
          <h2 className="text-center font-semibold mb-4">Derniers matchs joués</h2>
          <div className="flex justify-center gap-8 flex-wrap">
            {finishedMatches.length > 0 ? (
  finishedMatches.map((m: any, idx: number) => (
    // Prefer a unique match identifier for the key; fallback to idx if not available
    <React.Fragment key={m.match ? `finished-${m.match}` : `finished-idx-${idx}`}>
      {renderMatch(m, true)}
    </React.Fragment>
  ))
) : (
  <span className="text-gray-400">Aucun match terminé</span>
)}
          </div>
        </section>

        <section>
          <h2 className="text-center font-semibold mb-4">Prochains matchs à venir</h2>
          <div className="flex justify-center gap-8 flex-wrap">
            {upcomingMatches.length > 0 ? (
  upcomingMatches.map((m: any, idx: number) => (
    // Prefer a unique match identifier for the key; fallback to idx if not available
    <React.Fragment key={m.match ? `upcoming-${m.match}` : `upcoming-idx-${idx}`}>
      {renderMatch(m, false)}
    </React.Fragment>
  ))
) : (
  <span className="text-gray-400">Aucun match à venir</span>
)}
          </div>
        </section>
      </div>
      <div className=" absolute bottom-[28%] left-[75%]">
        <Chat/>
      </div>
    </div>
    </div>
  );
};

export default TournamentT2;


