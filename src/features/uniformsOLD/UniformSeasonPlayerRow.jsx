import styled from 'styled-components';

import Table from '../../ui/Table';

import { useEffect, useState } from 'react';

import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import {
  useCreateData,
  useData,
  useUpdateData,
} from '../../services/useUniversal';

const UniformSeasonPlayer = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
  text-align: center;
`;

function UniformSeasonPlayerRow({ uniformSeason }) {
  const { uniformid, number, size, lost, jerseyid } = uniformSeason;

  const { currentSeason } = useCurrentSeason();
  const { isLoading: isLoadingPlayerSeason, data: playerSeason } = useData({
    table: 'playerSeasons',
    filter: [
      { field: 'seasonId', value: currentSeason },
      { field: 'status', value: 'Rostered' },
    ],
  });
  const {
    isloading: isLoadingUniformSeasonPlayers,
    data: uniformSeasonPlayers,
  } = useData({
    table: 'uniformSeasonPlayers',
    filter: [
      { field: 'season', value: currentSeason },
      // { field: 'jerseyid', value: jerseyid },
    ],
  });

  const {
    isUpdating: isUpdatingUniformSeasonPlayers,
    updateData: updateUniformSeasonPlayers,
  } = useUpdateData();
  const { isCreating, createData: createUniformSeasonPlayers } =
    useCreateData();

  const [selectedUniformSeason, setSelectedUniformSeason] = useState(null);

  useEffect(
    function () {
      if (!isLoadingPlayerSeason && !isLoadingUniformSeasonPlayers)
        setSelectedUniformSeason(
          uniformSeasonPlayers.find((uniform) => uniform.jerseyid === jerseyid)
        );
    },
    [
      uniformSeasonPlayers,
      isLoadingPlayerSeason,
      isLoadingUniformSeasonPlayers,
      jerseyid,
    ]
  );

  function handleJerseyAssignment(e) {
    const newUniformSeasonPlayers = {
      seasonPlayer: +e.target.value,
      id: selectedUniformSeason.id,
      uniform: jerseyid,
    };

    const [newPlayer] = playerSeason
      .filter((player) => player.id === newUniformSeasonPlayers.seasonPlayer)
      .map((player) => ({
        id: player.id,
        fullname: player.fullname,
        seasonPlayer: newUniformSeasonPlayers.seasonPlayer,
      }));
    playerSeason
      .filter((player) => player.id === newUniformSeasonPlayers.seasonPlayer)
      .map((player) => ({
        id: player.id,
        fullname: player.fullname,
        seasonPlayer: newUniformSeasonPlayers.seasonPlayer,
      }));

    if (selectedUniformSeason.seasonPlayer)
      updateUniformSeasonPlayers({
        table: 'uniformSeasonPlayers',
        newData: {
          ...newUniformSeasonPlayers,
        },
        id: selectedUniformSeason.id,
      });
    else
      createUniformSeasonPlayers({
        table: 'uniformSeasonPlayers',
        newData: newUniformSeasonPlayers,
        toast: false,
      });

    setSelectedUniformSeason(newPlayer);
  }
  if (
    isLoadingPlayerSeason ||
    isLoadingUniformSeasonPlayers ||
    isUpdatingUniformSeasonPlayers
  )
    return;

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
                selectedUniformSeason?.seasonPlayer
                  ? selectedUniformSeason.seasonPlayer
                  : 'available'
              }
            >
              <option value="available">Available</option>
              {playerSeason.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.fullname}
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
