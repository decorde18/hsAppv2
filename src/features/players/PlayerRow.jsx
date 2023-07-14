import styled from 'styled-components';

import CreatePlayerForm from './CreatePlayerForm';

import { useCreatePlayer } from './useCreatePlayer';
import { useDeletePlayer } from './useDeletePlayer';

import { HiSquare2Stack, HiPencil, HiTrash } from 'react-icons/hi2';

import ConfirmDelete from '../../ui/ConfirmDelete';
import Modal from '../../ui/Modal';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';

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

const Player = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

function PlayerRow({ player }) {
  // const [showForm, setShowForm] = useState(false);
  const { isDeleting, deletePlayer } = useDeletePlayer();
  const { isCreating, createPlayer } = useCreatePlayer();
  console.log(player.id);
  return (
    <>
      <TableRow role="row">
        {/* <img src={image} /> */}
        <Player>{`${player.people.firstName} ${player.people.lastName}`}</Player>
        <Modal>
          {/* <Menus.Menu>
            <Menus.Toggle id={player.id} /> */}

          {/* <Menus.List id={player.id}>
              <Modal.Open opens="edit">
                <Menus.Button icon={HiPencil}>edit</Menus.Button>
              </Modal.Open>
              <Modal.Open opens="delete">
                <Menus.Button icon={HiTrash}>delete</Menus.Button>
              </Modal.Open>
            </Menus.List> */}

          {/* <Modal.Window name="edit">
              {<CreatePlayerForm playerToEdit={player} />}
            </Modal.Window> */}

          {/* <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="players"
                disabled={isDeleting}
                onConfirm={() => deletePlayer(player.id)}
              />
            </Modal.Window> */}
          {/* </Menus.Menu> */}
        </Modal>
      </TableRow>
      {/* {showForm && <CreatePlayerForm playerToEdit={player} />} */}
    </>
  );
}

export default PlayerRow;
