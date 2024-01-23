import { NavLink } from 'react-router-dom';
import Row from '../../../ui/Row';
import Spinner from '../../../ui/Spinner';
import { usePlayerSeason } from '../../players/usePlayerSeasons';
import Button from '../../../ui/Button';
import Modal from '../../../ui/Modal';
import ModalConfirm from '../../../ui/ModalConfirm';

function GameAfter({ game, editGame, isEditingGame, playerGames }) {
  const { isLoadingPlayerSeason, playerSeason } = usePlayerSeason(game.season);

  if (isLoadingPlayerSeason) return <Spinner />;
  if (playerGames.length === 0)
    return (
      <Modal>
        <ModalConfirm
          resourceName="event"
          onConfirm={() =>
            editGame({ newData: { status: 'to be played' }, id: game.id })
          }
          confirmType="create"
        />
      </Modal>
    );
  const eligiblePlayers =
    playerSeason.filter((player) => player.status === 'Rostered').length !==
      playerGames.length &&
    playerSeason
      .filter(
        (player) => !playerGames.includes((game) => game.player === player.id)
      )
      .filter((player) => player.status === 'Rostered');
  // console.log(eligiblePlayers);
  eligiblePlayers.length > 0 &&
    eligiblePlayers?.map(
      (player) => console.log({ game: game.id, player: player.playerId })
      // createPlayerGame({ game: game.id, player: player.playerId })
    );
  return (
    <div>
      This is after
      <Row type="horizontal" justify="center">
        <NavLink to={`./?gameId=${game.id}&edit=true`}>
          <Button
            name="manualGame"
            disabled={isEditingGame}
            variation="secondary"
          >
            Enter Stats Manually
          </Button>
        </NavLink>
      </Row>
    </div>
  );
}

export default GameAfter;
