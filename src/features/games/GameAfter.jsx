import Spinner from '../../ui/Spinner';
import { usePlayerSeason } from '../players/usePlayerSeasons';

function GameAfter({ game, playerGame }) {
  const { isLoadingPlayerSeason, playerSeason } = usePlayerSeason(game.season);

  if (isLoadingPlayerSeason) return <Spinner />;
  const eligiblePlayers =
    playerSeason.filter((player) => player.status === 'Rostered').length !==
      playerGame.length &&
    playerSeason
      .filter(
        (player) => !playerGame.includes((game) => game.player === player.id)
      )
      .filter((player) => player.status === 'Rostered');
  // console.log(eligiblePlayers);
  eligiblePlayers.length > 0 &&
    eligiblePlayers?.map(
      (player) => console.log({ game: game.id, player: player.playerId })
      // createPlayerGame({ game: game.id, player: player.playerId })
    );
  return <div>This is after</div>;
}

export default GameAfter;
