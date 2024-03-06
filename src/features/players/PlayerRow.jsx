import styled from 'styled-components';

import CreatePlayerForm from './CreatePlayerModalForm';

import { useDeletePlayer } from './useDeletePlayer';

import { HiPencil, HiTrash, HiEye } from 'react-icons/hi2';

import ModalConfirm from '../../ui/ModalConfirm';
import Modal from '../../ui/Modal';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import { formatDate } from '../../utils/helpers';
import PlayerIndividualPage from './PlayerIndividualPage';

const Player = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

function PlayerRow({ player }) {
  const { isDeleting, deletePlayer } = useDeletePlayer();

  const { id: playerId, firstName, lastName, dateOfBirth, seasons } = player;
  return (
    <Table.Row>
      <Player>{`${firstName} ${lastName}`}</Player>
      <Player>{dateOfBirth && formatDate(new Date(dateOfBirth))}</Player>
      <Player>{seasons}</Player>
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={playerId} />
            <Menus.List id={playerId}>
              <Modal.Open opens="view">
                <Menus.Button icon={<HiEye />}>View</Menus.Button>
              </Modal.Open>
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
            <Modal.Window name="view">
              {<PlayerIndividualPage player={player} />}
            </Modal.Window>
            <Modal.Window name="delete">
              <ModalConfirm
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
