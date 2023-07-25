import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
// import PlayerRow from './PlayerRow';
// import PlayerSeasonRow from './PlayerSeasonRow';
import { useGames } from './useGames';

import { useContext, useState } from 'react';
import Button from '../../ui/Button';
import Table from '../../ui/Table';
import Empty from '../../ui/Empty';
import GameRow from './GameRow';
import AddGame from './AddGame';
import { useSearchParams } from 'react-router-dom';
import { AppContext } from '../../ui/AppLayout';
import Menus from '../../ui/Menus';

const StyledDiv = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
`;
function GameTable({ seasonProps }) {
  const { currentSeason } = useContext(AppContext);
  const [scheduleType, setScheduleType] = useState('season');
  const { isLoadingGames, games } = useGames();

  function handleOnToggle(val) {
    setScheduleType(val);
  }

  if (isLoadingGames) return <Spinner />;
  if (!games.length || currentSeason === 'createSeason')
    return <Empty resource="Games" />;
  const gamesSeason = games.filter((game) => game.season == currentSeason);
  return (
    <Menus>
      <StyledDiv>
        <div>
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
        </div>
        <AddGame />
      </StyledDiv>

      <Table columns="0.3fr .5fr .5fr 2.2fr .5fr 1fr 1fr 1fr .6fr;">
        <Table.Header>
          <div></div>
          <div>Date</div>
          <div>Time</div>
          <div>Opponent</div>
          <div>Result</div>
          <div>Location</div>
          <div>Team</div>
          <div>Comment</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={scheduleType === 'season' ? gamesSeason : games}
          render={(game) => <GameRow game={game} key={game.id} />}
        />
      </Table>
    </Menus>
  );
}

export default GameTable;
