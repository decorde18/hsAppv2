import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
// import PlayerRow from './PlayerRow';
// import PlayerSeasonRow from './PlayerSeasonRow';
import { useGames } from './useGames';

import { useState } from 'react';
import Button from '../../ui/Button';
import Table from '../../ui/Table';
import Empty from '../../ui/Empty';
import GameRow from './GameRow';
import { useSearchParams } from 'react-router-dom';

const StyledDiv = styled.div`
  display: flex;
  gap: 2px;
`;
function GameTable({ seasonProps }) {
  const { currentSeason } = seasonProps;
  const [scheduleType, setScheduleType] = useState('season');
  const { isLoadingGames, games } = useGames();

  function handleOnToggle(val) {
    setScheduleType(val);
  }

  if (isLoadingGames) return <Spinner />;
  if (!games.length) return <Empty resource="Games" />;
  const gamesSeason = games.filter((game) => game.season == currentSeason);
  return (
    <>
      <StyledDiv>
        <Button
          variation={scheduleType === 'season' ? 'primary' : 'secondary'}
          onClick={() => handleOnToggle('season')}
        >
          Current SEASON
        </Button>
        <Button
          variation={scheduleType === 'allTime' ? 'primary' : 'secondary'}
          onClick={() => handleOnToggle('allTime')}
        >
          ALL TIME
        </Button>
      </StyledDiv>

      <Table columns="0.6fr .5fr .5fr 2.2fr 1fr 1fr .6fr;">
        <Table.Header>
          <div></div>
          <div>Date</div>
          <div>Time</div>
          <div>Opponent</div>
          <div>Location</div>
          <div>Team</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={scheduleType === 'season' ? gamesSeason : games}
          render={(game) => <GameRow game={game} key={game.id} />}
        />
      </Table>
    </>
  );
}

export default GameTable;
