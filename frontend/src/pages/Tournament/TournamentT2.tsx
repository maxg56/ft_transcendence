import { useWaitroomListener } from '@/hooks/WedSooket/userWsWR';
import NextMatch from '@/components/Tournament/NextMatch';

const TournamentT2: React.FC = () => {
  const { lastResults, matches } = useWaitroomListener();

  // dedupe and split matches
  const finishedMatches = Array.isArray(lastResults)
    ? Array.from(new Map(lastResults.map((m: any) => [m.id, m])).values())
    : [];
  const upcomingMatches = Array.isArray(matches)
    ? Array.from(new Map(matches.map((m: any) => [m.id, m])).values()).filter((m: any) => m.status !== 'finished')
    : [];

  // Affichage d'un match (résultat ou à venir)
  const renderMatch = (m: any, showResult = false) => (
    <NextMatch matchData={m} currentUser={""} showResult={showResult} />
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="space-y-16">
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


