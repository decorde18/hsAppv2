import styled from 'styled-components';

// import UniformJerseyCreateForm from './UniformJerseyCreateForm';

import { HiSquare2Stack, HiPencil, HiTrash } from 'react-icons/hi2';

import Modal from '../../ui/Modal';
import ModalConfirm from '../../ui/ModalConfirm';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import { useState } from 'react';
import Switch from '../../ui/Switch';
import {
  useCreateData,
  useDeleteData,
  useUpdateData,
} from '../../services/useUniversal';

const UniformJersey = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
  text-align: center;
`;

function UniformJerseyRow({ uniformJersey }) {
  const { isDeleting, deleteData } = useDeleteData();
  const { isCreating, createData } = useCreateData();
  const { isUpdating, updateData } = useUpdateData();

  const { jerseyid: id, number, size, lost } = uniformJersey;
  const [lostState, setLostState] = useState(lost);

  function handleDuplicate() {
    createData({
      table: 'uniformJerseys',
      newData: {
        id,
        number,
        size,
      },
    });
  }
  function handleToggleLost() {
    updateData({
      table: 'uniformJerseys',
      newData: {
        lost: !lostState,
      },
      id,
    });
    setLostState(!lostState);
  }

  return (
    <Table.Row>
      <div></div>
      <UniformJersey>{number}</UniformJersey>
      <UniformJersey>{size}</UniformJersey>
      <Switch
        checked={!lostState}
        id2={`lost-${id}`}
        onChange={handleToggleLost}
      ></Switch>
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={id} />

            <Menus.List id={id}>
              <Menus.Button
                icon={HiSquare2Stack}
                onClick={handleDuplicate}
                disabled={isCreating}
              >
                Duplicate
              </Menus.Button>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>edit</Menus.Button>
              </Modal.Open>
              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit">
              {/* {<UniformJerseyCreateForm uniformToEdit={uniformJersey} />} */}
            </Modal.Window>

            <Modal.Window name="delete">
              <ModalConfirm
                resourceName="uniforms"
                disabled={isDeleting}
                onConfirm={() => deleteData(id)}
                confirmType="delete"
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default UniformJerseyRow;
