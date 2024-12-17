import { useSearchParams } from 'react-router-dom';
import { GameContextProvider } from '../contexts/GameContext';
import { PlayerContextProvider } from '../contexts/PlayerContext';
import GameContainer from '../features/games/gameStatsEntry/GameContainer';
import Spinner from '../ui/Spinner';
import useGameData from '../hooks/useGameData';

function Game() {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');
  searchParams.delete('season');

  // Call the useGameData hook with the gameId prop
  const { isLoading, error, playerGame, playerSeason, ...gameDetails } =
    useGameData(gameId);
  const playerDetails = { playerGame, playerSeason };
  // Handle loading state (e.g., show a loading spinner or message)

  if (isLoading) {
    return <Spinner />;
  }

  // Handle error state (e.g., show an error message)
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <GameContextProvider gameDetails={gameDetails}>
      <PlayerContextProvider
        playerDetails={playerDetails}
        gameDetails={gameDetails}
      >
        <GameContainer />
      </PlayerContextProvider>
    </GameContextProvider>
  );
}

export default Game;
