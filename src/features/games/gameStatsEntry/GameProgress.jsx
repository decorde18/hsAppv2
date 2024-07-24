import { useCreateData, useUpdateData } from '../../../services/useUniversal';
import { getCurrentTime } from '../../../utils/helpers';

import GameAfter from './GameAfter';
import GameDuring from './GameDuring';
import GameBefore from './GameBefore';

import styled from 'styled-components';
import { useGameContext } from '../../../contexts/GameContext';
import { PlayerContextProvider } from '../../../contexts/PlayerContext';

const Div = styled.div`
  /* display: flex; */
  /* height: 100%; */
`;

function GameProgress() {
  const {
    game,
    periods,
    setGameData,
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
  function createPeriod({ period, default_time }) {
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
    <PlayerContextProvider>
      <Div>
        {(() => {
          switch (game.status) {
            case 'completed':
              return <GameAfter isWorking={isWorking} />;
            case 'to be played':
              return (
                <GameBefore
                  handleStartGame={handleStartGame}
                  isWorking={isWorking}
                />
              );
            default:
              return (
                <GameDuring updateStates={updateStates} isWorking={isWorking} />
              );
          }
        })()}
      </Div>
    </PlayerContextProvider>
  );
  //TODO Modal for stats edit - needed for game during and game after
}

export { GameProgress };
