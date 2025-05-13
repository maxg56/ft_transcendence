import { Player } from '@/types/WF';


const PlayerCircle = ({ player, index, total }: { player: Player; index: number; total: number }) => {
    const radius = 120;
    const angle = (360 / total) * index;
    const transform = `rotate(${angle}deg) translate(0, -${radius}px) rotate(-${angle}deg)`;
  
    return (
      <div className="absolute" style={{ transform }}>
        <div className="flex flex-col items-center">
          <img
            src={player.avatar || `https://robohash.org/${player.username}`}
            alt={player.username}
            className="w-12 h-12 rounded-full mb-1 object-cover"
          />
          <span className="text-sm font-medium flex items-center">
            {player.username}
            {player.isHost && (
              <span role="img" aria-label="crown" className="ml-1 text-yellow-500">
                👑
              </span>
            )}
          </span>
        </div>
      </div>
    );
  };
  
export default PlayerCircle;