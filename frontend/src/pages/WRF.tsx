import TournamentCode from '@/components/Tournament/TournamentCode';
import ParticipantsList from '@/components/Tournament/TournamentList';
import { useWaitroomListener } from '@/hooks/WedSooket/userWsWR';



const Private_game = () => {
	const { code, players } = useWaitroomListener();
	
	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className='text-center flex flex-col'>
				Code de la partie
				<TournamentCode
				code={code}/>
			</div>
			<div className="flex justify-center mt-12">
				<ParticipantsList players={players} code={code}/>
			</div>
		</div>
	);
};

export default Private_game;