import { useSearchParams } from 'react-router-dom';

import Spinner from '../ui/Spinner';
import GameBefore from '../features/games/GameBefore';
import GameDuring from '../features/games/GameDuring';
import GameAfter from '../features/games/GameAfter';

import { useGame } from '../features/games/useGames';

function Game() {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');
  const { isLoadingGame, game } = useGame(gameId);

  const isWorking = isLoadingGame;

  if (isWorking) return <Spinner />;
  return (
    <>
      {game.status === 'to be played' ? (
        <GameBefore game={game} />
      ) : game.status === 'started' ? (
        <GameDuring game={game} />
      ) : (
        <GameAfter game={game} />
      )}
    </>
  );
}

export default Game;
