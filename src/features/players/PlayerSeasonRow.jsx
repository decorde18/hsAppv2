import styled from 'styled-components';
import { useState } from 'react';

import Spinner from '../../ui/Spinner';
// import { useSettings } from './useSettings';
import { useUpdatePlayerSeason } from './useUpdatePlayerSeason';

import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 0.5fr 0.5fr 0.5fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  padding: 0 2rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Player = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  /* font-family: 'Sono'; */
`;

const Price = styled.div`
  font-family: 'Sono';
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-green-700);
`;

function PlayerSeasonRow({ playerSeason }) {
  const { players: player } = playerSeason;
  const { people } = player;
  // const { isLoading } = useSettings();
  const { updateSetting, isUpdating } = useUpdatePlayerSeason();

  // return <Spinner />;
  // if (isLoading) return <Spinner />;

  function handleChange(e, field, id) {
    const { value } = e.target;
    if (!value) return;
    updateSetting({ [field]: value, id });
  }

  return (
    <>
      <TableRow role="row">
        <Player>{`${people.firstName} ${people.lastName}`}</Player>
        <select
          defaultValue={playerSeason.status}
          onChange={(e) => handleChange(e, 'status', playerSeason.id)}
          // disabled={isUpdating}
        >
          <option value="Rostered">Rostered</option>
          <option value="Trying Out">Trying Out</option>
          <option value="Interested">Interested</option>
          <option value="Not Playing">Not Playing</option>
        </select>
        <div>{player.dateOfBirth}</div>
        <div>{player.entryYear}</div>
        <div>{playerSeason.grade}</div>
        <div>{playerSeason.returningPlayer ? 'YES' : 'NO'}</div>
        <div>{playerSeason.teamLevel}</div>
      </TableRow>
      {/* {showForm && <CreateCabinForm cabinToEdit={cabin} />} */}
    </>
  );
}

export default PlayerSeasonRow;