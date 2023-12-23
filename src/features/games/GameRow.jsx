import styled, { css } from 'styled-components';
import { useState } from 'react';
import Table from '../../ui/Table';
import { format } from 'date-fns';
import { formatTime, formatDate } from '../../utils/helpers';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import {
  HiPencil,
  HiSquare2Stack,
  HiTrash,
  HiMiniXMark,
} from 'react-icons/hi2';
import { useDeleteGame, useCancelGame } from './useGames';
import ConfirmDelete from '../../ui/ConfirmDelete';
import ConfirmCancel from '../../ui/ConfirmCancel';
import CreateGameForm from './CreateGameForm';

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  padding: 0 2rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;
const Opponent = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;
const results = {
  W: css`
    color: green;
  `,
  L: css`
    color: red;
  `,
};
const Result = styled.div`
  ${(props) => results[props.result]}
`;
function GameRow({ game }) {
  const { isDeleting, deleteGame } = useDeleteGame();
  const { isCanceling, cancelGame } = useCancelGame();
  //TODO getOwnScore and opponentScore
  // const { isLoadingGamePeriods, periods } = useGamePeriods();
  const ownScore = game.goals.filter(
    (goal) => goal?.event === 'Goal Scored'
  ).length;
  const opponentScore = game.goals.filter(
    (goal) => goal?.event === 'Goal Against'
  ).length;
  const status = game.status === 'to be played' ? null : game.status;
  const result = // if there is a score post it regardless of game type, otherwise only varsity non-scrimmages should eb posted
    game.status === 'completed'
      ? ownScore ||
        opponentScore ||
        (game.teamType === 'Varsity' && game.gameType !== 'Scrimmage')
        ? ownScore > opponentScore
          ? 'W'
          : ownScore === opponentScore
          ? 'T'
          : 'L'
        : null
      : game.status;
  return (
    <Table.Row>
      <div></div>
      <div>{game.date && formatDate(new Date(game.date))}</div>
      <div>{game.time && formatTime(game.time, true)}</div>
      <Opponent>{game.schools.school}</Opponent>
      {result ? (
        <Result result={result}>
          {status === 'completed'
            ? `${result} ${ownScore}-${opponentScore}`
            : status}
        </Result>
      ) : (
        <div></div>
      )}
      <div>{game.locations.name}</div>
      <div>{game.teamType}</div>
      <div>{game.comment}</div>
      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={game.id} />
          <Menus.List id={game.id}>
            <Modal.Open opens="edit">
              <Menus.Button icon={<HiPencil />}>edit</Menus.Button>
            </Modal.Open>
            <Modal.Open opens="cancel">
              <Menus.Button icon={<HiMiniXMark />}>cancel</Menus.Button>
            </Modal.Open>
            <Modal.Open opens="delete">
              <Menus.Button icon={<HiTrash />}>delete</Menus.Button>
            </Modal.Open>
          </Menus.List>
        </Menus.Menu>
        <Modal.Window name="edit">
          {<CreateGameForm gameToEdit={game} />}
        </Modal.Window>
        <Modal.Window name="cancel">
          <ConfirmCancel
            resourceName="games"
            disabled={isDeleting}
            onConfirm={() => cancelGame(game.id)}
          />
        </Modal.Window>
        <Modal.Window name="delete">
          <ConfirmDelete
            resourceName="games"
            onConfirm={() =>
              deleteGame({
                id: game.id,
                calendar: game.teamType,
                calId: game.calId,
              })
            }
            disabled={isDeleting}
          />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}

export default GameRow;
