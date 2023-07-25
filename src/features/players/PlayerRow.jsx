import styled from 'styled-components';

import CreatePlayerForm from './CreatePlayerForm';

import { useDeletePlayer } from './useDeletePlayer';

import { HiPencil, HiTrash } from 'react-icons/hi2';

import ConfirmDelete from '../../ui/ConfirmDelete';
import Modal from '../../ui/Modal';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import { format } from 'date-fns';

const Player = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

function PlayerRow({ player }) {
  const { isDeleting, deletePlayer } = useDeletePlayer();

  const {
    id: playerId,
    people: { firstName, lastName },
    dateOfBirth,
  } = player;
  return (
    <Table.Row>
      <div></div>
      <Player>{`${firstName} ${lastName}`}</Player>
      <Player>
        {dateOfBirth && format(new Date(dateOfBirth), 'MM/dd/yy')}
      </Player>
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={playerId} />
            <Menus.List id={playerId}>
              <Modal.Open opens="edit">
                <Menus.Button icon={HiPencil}>edit</Menus.Button>
              </Modal.Open>
              <Modal.Open opens="delete">
                <Menus.Button icon={HiTrash}>delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit">
              {<CreatePlayerForm playerToEdit={player} />}
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="player"
                disabled={isDeleting}
                onConfirm={() => deletePlayer(playerId)}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default PlayerRow;
