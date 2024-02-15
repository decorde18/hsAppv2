import styled from 'styled-components';

import { useSearchParams } from 'react-router-dom';

import Spinner from '../ui/Spinner';
import GameBefore from '../features/games/gameStatsEntry/GameBefore';
import GameDuring from '../features/games/gameStatsEntry/GameDuring';
import GameAfter from '../features/games/gameStatsEntry/GameAfter';
import GameHeader from '../features/games/gameStatsEntry/GameHeader';
import GameSettings from '../features/games/gameStatsEntry/GameSettings';

import { useGame, useEditGame } from '../features/games/useGames';
import { usePlayerGames } from '../features/players/usePlayerGames';
import { usePeriods } from '../features/games/gameStatsEntry/usePeriods';
import { useMinorEvents } from '../features/games/gameStatsEntry/useMinorEvents';
import { useStoppages } from '../features/games/gameStatsEntry/useStoppages';
import { useSubs } from '../features/games/gameStatsEntry/useSubs';

import GameStatsEdit from '../features/games/gameStatsEntry/GameStatsEdit';

function Game() {
  const [searchParams] = useSearchParams();
  const edit = searchParams.get('edit');
  const { isLoadingGame, game } = useGame();
  const { editGame, isEditing } = useEditGame();
  const { isLoadingPeriods, periods } = usePeriods();
  const { isLoadingMinorEvents, minorEvents } = useMinorEvents();
  const { isLoadingStoppages, stoppages } = useStoppages();
  const { isLoadingSubs, subs } = useSubs();
  const { isLoadingPlayerGames, playerGames } = usePlayerGames();

  const isWorking =
    isLoadingGame ||
    isLoadingPlayerGames ||
    isLoadingPeriods ||
    isLoadingMinorEvents ||
    isLoadingStoppages ||
    isLoadingSubs;

  if (isWorking) return <Spinner />;
  const props = {
    game,
    editGame,
    isEditingGame: isEditing,
    playerGames,
    periods,
    minorEvents,
    stoppages,
    subs,
  };
  //TODO FIXME take props out of all these pages
  return (
    <>
      {edit ? (
        <>
          <GameHeader game={game} stoppages={stoppages} />
          <GameStatsEdit props={props} />
        </>
      ) : game.status === 'to be played' ? (
        <>
          <GameHeader game={game} stoppages={stoppages} />
          <GameSettings
            game={game}
            editGame={editGame}
            isEditingGame={isEditing}
            playerGames={playerGames}
            expand={false}
          />
          <GameBefore editGame={editGame} isEditingGame={isEditing} />
        </>
      ) : game.status === 'started' ? (
        <GameDuring
          game={game}
          // editGame={editGame}
          // isEditingGame={isEditing}
          // playerGames={playerGames}
          // periods={periods}
        />
      ) : (
        <>
          <GameHeader game={game} stoppages={stoppages} />
          <GameSettings
            game={game}
            editGame={editGame}
            isEditingGame={isEditing}
            playerGames={playerGames}
            expand={false}
          />
          <GameAfter
            game={game}
            playerGames={playerGames}
            editGame={editGame}
          />
        </>
      )}
    </>
  );
}

export default Game;
