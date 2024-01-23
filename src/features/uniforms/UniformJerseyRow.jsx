import styled from 'styled-components';

import UniformJerseyCreateForm from './UniformJerseyCreateForm';
import {
  useDeleteUniformJersey,
  useUniformJerseys,
  useCreateUniformJersey,
  useUpdateUniformJersey,
} from './useUniforms';

import { HiSquare2Stack, HiPencil, HiTrash } from 'react-icons/hi2';

import Modal from '../../ui/Modal';
import ModalConfirm from '../../ui/ModalConfirm';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import { useState } from 'react';
import Switch from '../../ui/Switch';

const UniformJersey = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
  text-align: center;
`;

function UniformJerseyRow({ uniformJersey }) {
  const { isDeleting, deleteUniformJersey } = useDeleteUniformJersey();
  const { createUniformJersey, isCreating } = useCreateUniformJersey();
  const { isUpdatingJersey, updateUniformJersey } = useUpdateUniformJersey();

  const { id, number, size, lost } = uniformJersey;
  const [lostState, setLostState] = useState(lost);

  function handleDuplicate() {
    createUniformJersey({
      id,
      number,
      size,
    });
  }
  function handleToggleLost() {
    updateUniformJersey({
      newUniformData: {
        active: !lostState,
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
        isOn={!lostState}
        id2={`lost-${id}`}
        handleToggle={handleToggleLost}
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
              {<UniformJerseyCreateForm uniformToEdit={uniformJersey} />}
            </Modal.Window>

            <Modal.Window name="delete">
              <ModalConfirm
                resourceName="uniforms"
                disabled={isDeleting}
                onConfirm={() => deleteUniformJersey(id)}
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
