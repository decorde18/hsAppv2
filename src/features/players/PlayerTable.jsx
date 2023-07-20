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
import AddPlayer from './AddPlayer';

const StyledDiv = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
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
        <div>
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
        </div>
        <AddPlayer />
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
