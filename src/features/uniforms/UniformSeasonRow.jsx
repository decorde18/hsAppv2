import styled from 'styled-components';

import UniformSeasonCreateForm from './UniformSeasonCreateForm';
import {
  useDeleteUniformSeason,
  useUniformSeasons,
  useCreateUniformSeason,
  useUpdateUniformSeason,
} from './useUniforms';

import { HiSquare2Stack, HiPencil, HiTrash } from 'react-icons/hi2';

import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import { useState } from 'react';
import Switch from '../../ui/Switch';

const UniformSeason = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
  text-align: center;
`;

function UniformSeasonRow({ uniformSeason }) {
  const { isDeleting, deleteUniformSeason } = useDeleteUniformSeason();
  const { createUniformSeason, isCreating } = useCreateUniformSeason();
  const { isUpdatingJersey, updateUniformSeason } = useUpdateUniformSeason();
  const currentSeason = +localStorage.getItem('currentSeason');
  const { id, team, uniforms, uniform } = uniformSeason;
  const { type, style, color } = uniforms;
  function handleDuplicate() {
    createUniformSeason({
      season: currentSeason,
      team,
      uniform,
    });
  }

  return (
    <Table.Row>
      <div></div>
      <UniformSeason>{team}</UniformSeason>
      <UniformSeason>{`${type} (${color})- ${style}  `}</UniformSeason>
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
                <Menus.Button icon={HiPencil}>edit</Menus.Button>
              </Modal.Open>
              <Modal.Open opens="delete">
                <Menus.Button icon={HiTrash}>delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit">
              {<UniformSeasonCreateForm uniformToEdit={uniformSeason} />}
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="uniforms"
                disabled={isDeleting}
                onConfirm={() => deleteUniformSeason(id)}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default UniformSeasonRow;
