import { useWaitroomListener } from '@/hooks/WedSooket/userWsWR';
import NextMatch from '@/components/Tournament/NextMatch';
import CountdownTimer from '@/components/CountdownTimer';
import React, { useState, useEffect } from 'react';

import { toast } from 'sonner';

const TournamentT2: React.FC = () => {
  const { lastResults, matches, isHost, code, sendTournamentNextStep } = useWaitroomListener();
  const [waiting, setWaiting] = useState(true);
  const [loadingNextStep, setLoadingNextStep] = useState(false);

  // Handler pour le bouton host
  const handleNextStep = async () => {
    try {
      setLoadingNextStep(true);
      // On suppose que le code est l'id du tournoi et le hostId est dans le cookie myName
      const hostId = window?.Cookies?.get?.('myName') || '';
      await sendTournamentNextStep(code, hostId);
      toast.success('Prochaine étape demandée au serveur.');
    } catch (e) {
      toast.error('Erreur lors de la demande de prochaine étape.');
    } finally {
      setLoadingNextStep(false);
    }
  };


  useEffect(() => {
    const timer = setTimeout(async () => {
      setWaiting(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isHost, code, matches]);

  const finishedMatches = lastResults
  const upcomingMatches = matches

  // Affichage d'un match (résultat ou à venir)
  const renderMatch = (m: any, showResult = false) => (
    <NextMatch matchData={m} currentUser={""} showResult={showResult} />
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {isHost && !waiting && (
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
      {waiting && <CountdownTimer seconds={5} message="Préparation de la prochaine étape..." />}
      <div className={`space-y-16 ${waiting ? 'opacity-50 pointer-events-none select-none' : ''}`}>
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
    </div>
  );
};

export default TournamentT2;


