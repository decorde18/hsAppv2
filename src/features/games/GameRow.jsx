import styled, { css } from 'styled-components';
import { useState } from 'react';
import Table from '../../ui/Table';
import { format } from 'date-fns';
import { formatTime, formatDate } from '../../utils/helpers';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import { HiPencil, HiSquare2Stack, HiTrash } from 'react-icons/hi2';
import { useDeleteGame } from './useGames';
import ConfirmDelete from '../../ui/ConfirmDelete';
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
const Game = styled.div`
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
  //TODO getOwnScore and opponentScore
  const ownScore = 1;
  const opponentScore = 2;
  const result = ownScore
    ? ownScore > opponentScore
      ? 'W'
      : ownScore === opponentScore
      ? 'T'
      : 'L'
    : null;
  return (
    <>
      <Table.Row>
        <div></div>
        <div>{game.date && formatDate(new Date(game.date))}</div>
        <div>{game.time && formatTime(game.time, true)}</div>
        <Game>{game.schools.school}</Game>
        {result ? (
          <Result
            result={result}
          >{`${result} ${ownScore}-${opponentScore}`}</Result>
        ) : (
          <div></div>
        )}
        <div>{game.locations.name}</div>
        <div>{game.teamType}</div>
        <div>{game.comment}</div>
        <div>
          <Modal>
            <Menus.Menu>
              <Menus.Toggle id={game.id} />

              <Menus.List id={game.id}>
                <Modal.Open opens="edit">
                  <Menus.Button icon={HiPencil}>edit</Menus.Button>
                </Modal.Open>
                <Modal.Open opens="delete">
                  <Menus.Button icon={HiTrash}>delete</Menus.Button>
                </Modal.Open>
              </Menus.List>

              <Modal.Window name="edit">
                {<CreateGameForm gameToEdit={game} />}
              </Modal.Window>

              <Modal.Window name="delete">
                <ConfirmDelete
                  resourceName="games"
                  disabled={isDeleting}
                  onConfirm={() => deleteGame(game.id)}
                />
              </Modal.Window>
            </Menus.Menu>
          </Modal>
        </div>
      </Table.Row>
    </>
  );
}

export default GameRow;
