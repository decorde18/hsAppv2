import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
import PlayerRow from './PlayerRow';
import PlayerSeasonRow from './PlayerSeasonRow';
import { usePlayerSeasons, usePlayers } from './usePlayers';

import { useState } from 'react';
import Button from '../../ui/Button';
import Table from '../../ui/Table';
import Empty from '../../ui/Empty';

// const Table = styled.div`
//   border: 1px solid var(--color-grey-200);

//   font-size: 1.4rem;
//   background-color: var(--color-grey-0);
//   border-radius: 7px;
//   overflow: hidden;
// `;

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
const StyledDiv = styled.div`
  display: flex;
  gap: 2px;
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
  if (!players.length) return <Empty resource="Players" />;

  const playerSeason = playerSeasons.filter(
    (playerSeason) => playerSeason.seasons.id === +currentSeason
  );
  return (
    <>
      <StyledDiv>
        <Button
          variation={rosterType === 'season' ? 'primary' : 'secondary'}
          onClick={() => handleOnToggle('season')}
        >
          Current SEASON
        </Button>
        <Button
          variation={rosterType === 'allTime' ? 'primary' : 'secondary'}
          onClick={() => handleOnToggle('allTime')}
        >
          ALL TIME
        </Button>
      </StyledDiv>
      <Table columns="0.6fr .5fr .5fr 2.2fr 1fr 1fr .6fr;">
        <Table.Header>
          <div>Player</div>
          <div>Status</div>
          <div>DOB</div>
          <div>Entry Year</div>
          <div>Grade</div>
          <div>Returner</div>
          <div>Team</div>
        </Table.Header>
        <Table.Body
          data={rosterType === 'season' ? playerSeason : players}
          render={(player) =>
            rosterType === 'season' ? (
              <PlayerSeasonRow playerSeason={player} key={player.id} />
            ) : (
              <PlayerRow player={player} key={player.id} />
            )
          }
        />
      </Table>
    </>
  );
}

export default PlayerTable;
