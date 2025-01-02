import { useEffect, useState, createContext, useContext } from 'react';

import {
  useCreateData,
  useDeleteData,
  useUpdateData,
} from '../services/useUniversal';

import {
  getStatuses,
  meCategories,
} from '../features/games/gameStatsEntry/helpers/gameStatsEntryHelperFunctions';
import { getCurrentTime, subtractTime } from '../utils/helpers';
import { usePeriods } from '../features/games/gameStatsEntry/hooks/usePeriods';
import { useStoppages } from '../features/games/gameStatsEntry/hooks/useStoppages';
import { useMinorEvents } from '../features/games/gameStatsEntry/hooks/useMinorEvents';

import { useDiscipline } from '../features/games/gameStatsEntry/hooks/useDiscipline';
import { useGoals } from '../features/games/gameStatsEntry/hooks/useGoals';

const GameContext = createContext();

function GameContextProvider({ gameDetails, children }) {
  const { game, subs, subTotals, stoppages, minorEvents, periods } =
    gameDetails;

  const gameId = game.id;

  const { createData } = useCreateData();
  const { updateData } = useUpdateData();
  const { deleteData } = useDeleteData();

  const [gameDataArrays, setGameDataArrays] = useState({
    game: {},
    periods: [],
    minorEvents: [],
    stoppages: [],
    subs: [],
    subTotals: [],
  });

  const [gameData, setGameData] = useState({
    gameStatus: '',
    gameProgress: '',
    currentPeriod: {},
    periodStatus: 'regulation',
    stoppageStatus: false,
  });

  useEffect(() => {
    //sets the arrays on load
    // if (isWorking) return;

    setGameDataArrays({
      game,
      periods,
      stoppages,
      minorEvents: minorEvents.reduce(
        (acc, each) => ({
          ...acc,
          [each.team]: {
            ...acc[each.team],
            [each.eventType]: [...acc[each.team][each.eventType], each],
          },
        }),
        meCategories
      ),
      subs,
      subTotals,
    });
  }, [game, minorEvents, periods, stoppages, subTotals, subs]);

  useEffect(() => {
    //updates the status and progress on change in periods, game or stoppages
    if (!gameDataArrays.game.id) return;
    const statusUpdates = getStatuses({
      game: gameDataArrays.game,
      periods: gameDataArrays.periods,
      stoppages: gameDataArrays.stoppages,
    });
    if (statusUpdates.gameStatus === 'pending') {
      periodHandle.newPeriod(statusUpdates.newPeriodNeeded);
    } else {
      setGameData({
        gameStatus: statusUpdates.gameStatus,
        gameProgress: statusUpdates.gameProgress,
        currentPeriod: statusUpdates.currentPeriod,
        stoppageStatus: statusUpdates.stoppageStatus,
      });

      if (statusUpdates.gameStatus !== gameDataArrays.game.status)
        updateData({
          table: 'games',
          newData: { status: statusUpdates.gameStatus },
          id: gameId,
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameDataArrays.game, gameDataArrays.periods, gameDataArrays.stoppages]);

  const getGameTime = {
    fullGameTime: () =>
      gameDataArrays.periods.reduce(
        (acc, period) => (acc = acc + subtractTime(period.start, period.end)),
        0
      ) -
      stoppages.reduce(
        (acc, stoppage) =>
          (acc = acc + (stoppage.end - stoppage.begin) * stoppage.clockStopped),
        0
      ),
    gameTime: () =>
      //current time  - used for subs, stoppages, (in Seconds)
      //get previous period times
      {
        return (
          gameDataArrays.periods
            .filter((period) => period.period < gameData.currentPeriod.period)
            .reduce(
              (acc, period) =>
                (acc = acc + subtractTime(period.start, period.end)),
              0
              //add them together
            ) +
          (gameData.currentPeriod.start
            ? subtractTime(gameData.currentPeriod.start, getCurrentTime())
            : 0)
        );
        //get the current period time
      },
    periodTime: () => {
      //period time difference - includes stoppages - used for clocks

      return gameData.stoppageStatus.clockStopped
        ? gameData.stoppageStatus.begin
        : subtractTime(gameData.currentPeriod.start, getCurrentTime()) -
            (gameDataArrays.stoppages
              .filter(
                (stoppage) => stoppage.periodId === gameData.currentPeriod.id
              )
              .stoppages?.reduce(
                (acc, val) =>
                  (acc = acc + (val.end - val.begin) * val.clockStopped),
                0
              ) || 0);
    },

    elapsedGameTime: () => {},
    // game time - used for summarizing minute of game
  };
  function updateGame({ field, value }) {
    setGameData((prev) => ({ ...prev, [field]: value }));
  }
  function updateGameArrays({ field, value, deleteItem }) {
    if (deleteItem)
      setGameDataArrays((prev) => {
        const updatedArray = [
          ...prev[field].filter((item) => item.id !== value.id),
        ];

        return { ...prev, [field]: updatedArray };
      });
    else
      setGameDataArrays((prev) => {
        const updatedArray = [
          ...prev[field].filter((item) => item.id !== value.id),
          value,
        ];

        return { ...prev, [field]: updatedArray };
      });
  }

  const { periodHandle } = usePeriods({
    gameId,
    createData,
    updateData,
    deleteData,
    gameDataArrays,
    updateGameArrays,
    currentPeriod: gameData.currentPeriod,
    getCurrentTime,
    getGameTime,
  });
  const { stoppageHandle } = useStoppages({
    createData,
    updateData,
    deleteData,
    updateGame,
    gameDataArrays,
    gameData,
    getGameTime,
  });
  const { minorEventHandle } = useMinorEvents({
    gameId,
    createData,
    updateData,
    deleteData,
    updateGameArrays,
    currentPeriod: gameData.currentPeriod,
    setGameDataArrays,
    getGameTime,
  });
  const { goalHandle } = useGoals({
    createData,
    updateData,
    deleteData,
    gameData,
    getGameTime,
    stoppageHandle,
  });
  const { disciplineHandle } = useDiscipline({
    gameId,
    createData,
    updateData,
    deleteData,
    updateGameArrays,
    currentPeriod: gameData.currentPeriod,
    setGameDataArrays,
    getGameTime,
  });

  if (!gameDataArrays.game.id || !gameData.gameStatus) return;

  return (
    <GameContext.Provider
      value={{
        gameData,
        gameDataArrays,
        periodHandle,
        minorEventHandle,
        stoppageHandle,
        goalHandle,
        disciplineHandle,
        getGameTime,
        updateGameArrays,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined)
    throw new Error('GameContext was used outside of GameContextProvider');

  return context;
}
export { GameContextProvider, useGameContext };
