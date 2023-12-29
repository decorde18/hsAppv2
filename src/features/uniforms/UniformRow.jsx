import styled from 'styled-components';

import UniformCreateForm from './UniformCreateForm';
import {
  useDeleteUniform,
  useUniforms,
  useCreateUniform,
  useUpdateUniform,
} from './useUniforms';

import { HiSquare2Stack, HiPencil, HiTrash } from 'react-icons/hi2';

import Modal from '../../ui/Modal';
import ConfirmModal from '../../ui/ConfirmModal';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import { useState } from 'react';
import Switch from '../../ui/Switch';

const Uniform = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

function UniformRow({ uniform }) {
  const { isDeleting, deleteUniform } = useDeleteUniform();
  const { createUniform, isCreating } = useCreateUniform();
  const { isUpdating, updateUniform } = useUpdateUniform();

  const { id, type, brand, color, style, year, active } = uniform;
  const [activeState, setActiveState] = useState(active);

  function handleDuplicate() {
    createUniform({
      type,
      brand,
      color,
      style,
      year,
    });
  }
  function handleToggleActive() {
    updateUniform({
      newUniformData: {
        active: !activeState,
      },
      id,
    });
    setActiveState(!activeState);
  }

  return (
    <Table.Row>
      <div></div>
      <Uniform>{type}</Uniform>
      <Uniform>{brand}</Uniform>
      <Uniform>{color}</Uniform>
      <Uniform>{style}</Uniform>
      <Uniform>{year}</Uniform>
      <Switch
        isOn={activeState}
        id2={`active-${id}`}
        handleToggle={handleToggleActive}
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
              {<UniformCreateForm uniformToEdit={uniform} />}
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmModal
                resourceName="uniforms"
                disabled={isDeleting}
                onConfirm={() => deleteUniform(id)}
                confirmType="delete"
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default UniformRow;
