import styled from 'styled-components';

import UniformSeasonPlayerCreateForm from './UniformSeasonPlayerCreateForm';
import {
  useDeleteUniformSeasonPlayers,
  useUniformSeasonPlayers,
  useCreateUniformSeasonPlayers,
  useUpdateUniformSeasonPlayers,
} from './useUniforms';
import { usePlayerSeason } from '../players/usePlayerSeasons';

import { HiSquare2Stack, HiPencil, HiTrash } from 'react-icons/hi2';

import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import { useEffect, useState } from 'react';
import Switch from '../../ui/Switch';
import Spinner from '../../ui/Spinner';

const UniformSeasonPlayer = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
  text-align: center;
`;

const currentSeason = +localStorage.getItem('currentSeason');
function UniformSeasonPlayerRow({ uniformSeason }) {
  const { isLoadingUniformSeasonPlayers, uniformSeasonPlayers } =
    useUniformSeasonPlayers();

  const { isUpdatingUniformSeasonPlayers, updateUniformSeasonPlayers } =
    useUpdateUniformSeasonPlayers();
  const { createUniformSeasonPlayers, isCreating } =
    useCreateUniformSeasonPlayers();

  const [selectedUniformSeason, setSelectedUniformSeason] = useState(null);
  const { isLoadingPlayerSeason, playerSeason } =
    usePlayerSeason(currentSeason);

  const { id, number, size, lost } = uniformSeason;
  useEffect(
    function () {
      if (!isLoadingPlayerSeason && !isLoadingUniformSeasonPlayers)
        setSelectedUniformSeason(
          uniformSeasonPlayers.find((uniform) => uniform.uniform === id)
        );
    },
    [
      id,
      uniformSeasonPlayers,
      isLoadingPlayerSeason,
      isLoadingUniformSeasonPlayers,
    ]
  );
  if (
    isLoadingPlayerSeason ||
    isLoadingUniformSeasonPlayers ||
    isUpdatingUniformSeasonPlayers
  )
    return;
  const playerSeasonFiltered = playerSeason.filter(
    (player) => player.status === 'Rostered'
  );
  function handleJerseyAssignment(e) {
    const newUniformSeasonPlayers = {
      seasonPlayer: e.target.value,
      uniform: id,
    };
    if (selectedUniformSeason)
      updateUniformSeasonPlayers({
        newUniformSeasonPlayers,
        id: selectedUniformSeason.id,
      });
    else createUniformSeasonPlayers(newUniformSeasonPlayers);
  }

  return (
    <div>
      <Table.Row>
        <div></div>
        <UniformSeasonPlayer>{number}</UniformSeasonPlayer>
        <UniformSeasonPlayer>{size}</UniformSeasonPlayer>
        <UniformSeasonPlayer>
          {lost ? (
            'Lost'
          ) : (
            <select
              onChange={handleJerseyAssignment}
              value={
                selectedUniformSeason
                  ? selectedUniformSeason.seasonPlayer
                  : 'available'
              }
            >
              <option value="available">Available</option>
              {playerSeasonFiltered.map((player) => (
                <option key={player.id} value={player.id}>
                  {`${player.players.people.firstName} ${player.players.people.lastName}`}
                </option>
              ))}
            </select>
          )}
        </UniformSeasonPlayer>

        <div></div>
      </Table.Row>
    </div>
  );
}

export default UniformSeasonPlayerRow;
