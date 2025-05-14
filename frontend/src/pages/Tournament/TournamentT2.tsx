import { useWaitroomListener } from '@/hooks/WedSooket/userWsWR';
import NextMatch from '@/components/Tournament/NextMatch';
import CountdownTimer from '@/components/CountdownTimer';
import React, { useState, useEffect } from 'react';

const TournamentT2: React.FC = () => {
  const { lastResults, matches, isHost, code, sendAckAndWait } = useWaitroomListener();
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setWaiting(false);
      if (isHost) {
        const matchId = Array.isArray(matches) && matches.length > 0 ? matches[0].id : code;
        await sendAckAndWait('tournament_update', matchId || code);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isHost, code, matches, sendAckAndWait]);

  const finishedMatches = Array.isArray(lastResults)
    ? Array.from(new Map(lastResults.map((m: any) => [m.id, m])).values())
    : [];
  const upcomingMatches = Array.isArray(matches)
    ? Array.from(new Map(matches.map((m: any) => [m.id, m])).values())
    : [];

  // Affichage d'un match (résultat ou à venir)
  const renderMatch = (m: any, showResult = false) => (
    <NextMatch matchData={m} currentUser={""} showResult={showResult} />
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {waiting && <CountdownTimer seconds={5} message="Préparation de la prochaine étape..." />}
      <div className={`space-y-16 ${waiting ? 'opacity-50 pointer-events-none select-none' : ''}`}>
        <section>
          <h2 className="text-center font-semibold mb-4">Derniers matchs joués</h2>
          <div className="flex justify-center gap-8 flex-wrap">
            {finishedMatches.length > 0 ? (
              finishedMatches.map((m: any) => renderMatch(m, true))
            ) : (
              <span className="text-gray-400">Aucun match terminé</span>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-center font-semibold mb-4">Prochains matchs à venir</h2>
          <div className="flex justify-center gap-8 flex-wrap">
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map((m: any) => renderMatch(m, false))
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


