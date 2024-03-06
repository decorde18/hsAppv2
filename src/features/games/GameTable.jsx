import styled from 'styled-components';
import Spinner from '../../ui/Spinner';

import { useGames } from './useGames';
import { useGoals, useGamePeriods } from './useGames';

import { useEffect, useState } from 'react';
import Button from '../../ui/Button';
import Table from '../../ui/Table';
import Empty from '../../ui/Empty';
import GameRow from './GameRow';
import AddGame from './AddGame';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import Menus from '../../ui/Menus';

import { useSeason } from '../seasons/useSeasons';

const StyledDiv = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
`;
function GameTable() {
  // Calendar();
  const { currentSeason } = useCurrentSeason();
  const { isLoadingSeason, season } = useSeason();

  const [scheduleType, setScheduleType] = useState('season');
  const { isLoadingGames, games } = useGames();

  const [seasonGames, setSeasonGames] = useState([]);

  const { isLoadingGoals, goals } = useGoals(currentSeason);

  useEffect(
    function () {
      if (isLoadingGames || isLoadingSeason) return;
      setSeasonGames(games);
    },
    [games, isLoadingGames, isLoadingSeason, seasonGames]
  );

  function handleOnToggle(val) {}

  if (isLoadingGames || isLoadingGoals) return <Spinner />;
  if (!seasonGames.length || currentSeason === 'createSeason')
    return (
      <>
        <Empty resource="Games" />
        <AddGame />
      </>
    );

  const gamesWithGoals = seasonGames.map((game) => ({
    ...seasonGames,
    goals: goals.filter((goal) => goal.periodId.game.id === game.id),
  }));
  const gamesSeasonWithGoals = seasonGames.map((game) => ({
    ...game,
    goals: goals.filter((goal) => goal.periodId.game.id == game.id),
  }));

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

      <Table columns=".1fr .75fr .75fr 3.5fr .75fr 2.5fr 1fr 2.5fr .1fr">
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
          data={
            scheduleType === 'season' ? gamesSeasonWithGoals : gamesWithGoals
          }
          render={(game) => <GameRow game={game} key={game.id} />}
        />
      </Table>
    </Menus>
  );
}

export default GameTable;
