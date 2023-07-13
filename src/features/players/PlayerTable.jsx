import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
import PlayerRow from './PlayerRow';
import PlayerSeasonRow from './PlayerSeasonRow';
import { usePlayerSeasons, usePlayers } from './usePlayers';

import { useState } from 'react';
import Button from '../../components/Button';

const Table = styled.div`
  border: 1px solid var(--color-grey-200);

  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const TableHeader = styled.header`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 0.5fr 0.5fr 0.5fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  text-align: center;
  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
  padding: 1.6rem 2.4rem;
`;
function PlayerTable({ seasonProps }) {
  const { currentSeason } = seasonProps;
  const [rosterType, setRosterType] = useState('season');
  const { isLoadingPlayers, players } = usePlayers();
  const { isLoadingPlayerSeasons, playerSeasons } = usePlayerSeasons();
  function handleOnToggle(val) {
    setRosterType(val);
  }
  if (isLoadingPlayers || isLoadingPlayerSeasons) return <Spinner />;
  return (
    <>
      <div>
        <Button onClick={() => handleOnToggle('season')}>Current SEASON</Button>
        <Button onClick={() => handleOnToggle('allTime')}>ALL TIME</Button>
      </div>

      <Table role="table">
        <TableHeader role="row">
          <div>Player</div>
          <div>Status</div>
          <div>DOB</div>
          <div>Entry Year</div>
          <div>Grade</div>
          <div>Returner</div>
          <div>Team</div>
        </TableHeader>
        {rosterType === 'season' &&
          playerSeasons
            .filter(
              (playerSeason) => playerSeason.seasons.id === +currentSeason
            )
            .map((playerSeason) => (
              <PlayerSeasonRow
                playerSeason={playerSeason}
                key={playerSeason.id}
              />
            ))}
        {rosterType === 'allTime' &&
          players.map((player) => (
            <PlayerRow player={player} key={player.id} />
          ))}
      </Table>
    </>
  );
}

export default PlayerTable;
