import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
import PlayerRow from './PlayerRow';
import PlayerSeasonRow from './PlayerSeasonRow';
import { usePlayerSeasons, usePlayers } from './usePlayers';

import { useState } from 'react';
import Button from '../../ui/Button';
import Table from '../../ui/Table';
import Empty from '../../ui/Empty';
import Menus from '../../ui/Menus';

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
  if (isLoadingPlayers || isLoadingPlayerSeasons) return <Spinner />;
  if (!players.length) return <Empty resource="Players" />;

  function handleOnToggle(val) {
    setRosterType(val);
  }
  const playerSeason = playerSeasons.filter(
    (playerSeason) => playerSeason.seasons.id === +currentSeason
  );
  const isSeason = rosterType === 'season';
  const seasonTable = {
    head: (
      <>
        <div></div>
        <div>Player</div>
        <div>Status</div>
        <div>DOB</div>
        <div>Entry Year</div>
        <div>Grade</div>
        <div>Returner</div>
        <div>Team</div>
        <div></div>
      </>
    ),
    columns: '0.2fr 2fr 1fr .5fr .5fr .5fr .5fr 1fr .2fr;',
  };
  const table = {
    head: (
      <>
        <div></div>
        <div>Player</div>
        <div>DOB</div>
        <div></div>
      </>
    ),
    columns: '0.2fr 2fr 1fr .2fr;',
  };

  return (
    <>
      <StyledDiv>
        <Button
          variation={isSeason ? 'primary' : 'secondary'}
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
      <Menus>
        <Table columns={isSeason ? seasonTable.columns : table.columns}>
          <Table.Header>
            {isSeason ? seasonTable.head : table.head}
          </Table.Header>
          <Table.Body
            data={isSeason ? playerSeason : players}
            render={(player) =>
              isSeason ? (
                <PlayerSeasonRow playerSeason={player} key={player.id} />
              ) : (
                <PlayerRow player={player} key={player.id} />
              )
            }
          />
        </Table>
      </Menus>
    </>
  );
}

export default PlayerTable;
