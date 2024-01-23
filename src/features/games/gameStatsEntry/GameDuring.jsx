import { NavLink } from 'react-router-dom';

import Button from '../../../ui/Button';

import { usePlayerSeasonWithNumber } from '../../players/usePlayerSeasons';
import { useEffect } from 'react';

function GameDuring({ game, editGame, isEditingGame, playerGames }) {
  const { isLoadingPlayerSeasonWithNumber, playerSeasonWithNumber } =
    usePlayerSeasonWithNumber(game.season);
  const isWorking = isLoadingPlayerSeasonWithNumber;

  useEffect(() => {
    //update state of all values
    if (isLoadingPlayerSeasonWithNumber) return;
    const updatedPlayerGames = playerGames.map((player) => ({
      ...playerSeasonWithNumber.find((play) => play.playerId === player.player),
      ...player,
    }));
    //I only want it to run on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingPlayerSeasonWithNumber]);
  return (
    <>
      <NavLink to={`./?gameId=${game.id}&edit=true`}>
        <Button
          name="manualGame"
          disabled={isEditingGame}
          variation="secondary"
        >
          Edit Stats
        </Button>
      </NavLink>
      <div>This is during</div>;
    </>
  );
}

export default GameDuring;
