import styled from 'styled-components';

import CreatePlayerForm from './CreatePlayerModalForm';

import { useDeletePlayer } from './useDeletePlayer';

import { HiPencil, HiTrash } from 'react-icons/hi2';

import ConfirmModal from '../../ui/ConfirmModal';
import Modal from '../../ui/Modal';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import { format } from 'date-fns';
import { formatDate } from '../../utils/helpers';

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
      <Player>{dateOfBirth && formatDate(new Date(dateOfBirth))}</Player>
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={playerId} />
            <Menus.List id={playerId}>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>edit</Menus.Button>
              </Modal.Open>
              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit">
              {<CreatePlayerForm playerToEdit={player} />}
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmModal
                resourceName="player"
                disabled={isDeleting}
                onConfirm={() => deletePlayer(playerId)}
                confirmType="delete"
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default PlayerRow;
