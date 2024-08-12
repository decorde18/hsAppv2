import { useCreateData, useUpdateData } from '../../../services/useUniversal';
import { getCurrentTime } from '../../../utils/helpers';

import GameAfter from './GameAfter';
import GameDuring from './GameDuring';
import GameBefore from './GameBefore';

import styled from 'styled-components';
import { useGameContext } from '../../../contexts/GameContext';
import { PlayerContextProvider } from '../../../contexts/PlayerContext';
import GamePeriodBreak from './GamePeriodBreak';

const Div = styled.div`
  /* max-height: 90%; */
  /* overflow: hidden; */
`;

function GameProgress({ gameStatus, setGameStatus }) {
  const {
    game,
    periods,
    setGameData,
    currentPeriod,
    setCurrentPeriod,

    minorEventCategories,
    setMinorEventCategories,
  } = useGameContext();
  const { isCreating, createData } = useCreateData();
  const { isUpdating, updateData } = useUpdateData();

  function handleStartGame() {
    setGameData(() => ({ ...game, status: 'in progress' }));
    updateData({
      table: 'games',
      newData: [{ status: 'in progress' }],
      id: game.id,
    });
    createPeriod({ period: 1, default_time: game.reg_periods_minutes });
  }
  function startNextPeriod() {
    const period = currentPeriod.period + 1;
    createPeriod({ period, default_time: game.reg_periods_minutes });
  }
  function createPeriod({ period, default_time }) {
    setGameStatus('periodActive');
    setCurrentPeriod({
      game: game.id,
      period,
      start: getCurrentTime(),
      default_time,
    });
    createData({
      table: 'periods',
      newData: {
        game: game.id,
        period,
        start: getCurrentTime(),
        default_time,
      },
      view: 'periods',
      toast: false,
    });
  }
  function endPeriod() {
    setGameStatus('betweenPeriods');
    setCurrentPeriod({
      ...currentPeriod,
      end: getCurrentTime(),
    });
    updateData({
      table: 'periods',
      newData: [{ end: getCurrentTime() }],
      id: currentPeriod.id,
    });
  }
  function updateStates({ state, data }) {
    if (state === 'minorEventCategories') {
      const newData = {
        [data.team]: {
          ...minorEventCategories[data.team],
          [data.type]: [
            ...minorEventCategories[data.team][data.type],
            { periodId: periods[0].id, game: game.id, gameMinute: 2 }, //TODO make this object what it needs to be to update DB //todo on shot, need more information to get the player number
          ],
        },
      };
      setMinorEventCategories({
        ...minorEventCategories,
        ...newData,
      });
    }
  }
  const isWorking = isCreating || isUpdating;
  return (
    <Div>
      <PlayerContextProvider>
        {(() => {
          switch (gameStatus) {
            case 'endGame':
              return <GameAfter isWorking={isWorking} />;
            case 'beforeGame':
              return (
                <GameBefore
                  handleStartGame={handleStartGame}
                  isWorking={isWorking}
                />
              );
            case 'betweenPeriods':
              return <GamePeriodBreak startNextPeriod={startNextPeriod} />;
            default:
              return (
                <GameDuring
                  updateStates={updateStates}
                  isWorking={isWorking}
                  endPeriod={endPeriod}
                />
              );
          }
        })()}
      </PlayerContextProvider>
    </Div>
  );
  //TODO Modal for stats edit - needed for game during and game after
}

export { GameProgress };
