import { useEffect, useState, createContext, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  useCreateData,
  useData,
  useDeleteData,
  useUpdateData,
} from '../services/useUniversal';

import {
  getStatuses,
  meCategories,
} from '../features/games/gameStatsEntry/gameStatsEntryHelperFunctions';
import { getCurrentTime, subtractTime } from '../utils/helpers';

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
            ) + subtractTime(gameData.currentPeriod.start, getCurrentTime())
          //get he current period time
        );
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

  const periodHandle = {
    startGame: () =>
      createPeriod({
        period: 1,
        start: getCurrentTime(),
        default_time: gameDataArrays.game.reg_periods_minutes,
      }),
    newPeriod: (data) =>
      createPeriod({
        period: data.period,
        default_time: data.default_time,
      }),
    endPeriod: (data) => updatePeriod({ end: getCurrentTime() }),
    startPeriod: (data) => updatePeriod({ start: data.start }),
    updatePeriod,
    deletePeriod,
  };
  const minorEventHandle = {
    createMinorEvent,
    updateMinorEvent,
    deleteMinorEvent,
  };
  const stoppageHandle = {
    newStoppage: (data) => {
      updateGame({ field: 'stoppageStatus', value: true });
      createStoppage(data);
    },
    updateStoppage: (data) => {
      const newData = { ...gameData.stoppageStatus, ...data };
      updateGame({ field: 'stoppageStatus', value: newData });
      updateStoppage(data);
    },
    updateClockStopped: () => {
      const clockStopped = !gameData.stoppageStatus.clockStopped;
      const newData = { ...gameData.stoppageStatus, clockStopped };
      updateGame({
        field: 'stoppageStatus',
        value: newData,
      });
      updateStoppage({ clockStopped });
    },
    saveStoppage: (details) => {
      const end = getGameTime.gameTime();
      updateGame({ field: 'stoppageStatus', value: false });
      updateStoppage({ end, details });
    },
    cancelStoppage: () => deleteStoppage(),
    endStoppage: (data) => updateStoppage(data),
  };
  const goalHandle = {
    createGoal: (goalScored, details) => {
      const end = getGameTime.gameTime();
      const team = gameData.stoppageStatus.team;
      const event = team === 'for' ? 'Goal Scored' : 'Goal Against';
      const { goal, ...extraDetails } = goalScored;

      updateGame({ field: 'stoppageStatus', value: false });

      if (team === 'for') {
        //todo I AM HERE,
        updateGame({
          field: 'game',
          value: {
            ...gameDataArrays,
            game: { ...gameDataArrays.game, gf: gameDataArrays.game.gf++ },
          },
        });
        //todo send to server
        updateStoppage({ event, end, details }, extraDetails);
      } else {
        updateGame({
          field: 'game',
          value: {
            ...gameDataArrays,
            game: { ...gameDataArrays.game, ga: gameDataArrays.game.ga++ },
          },
        });
        //todo send to server
      }
    },
  };
  const disciplineHandle = {};

  function updateGame({ field, value }) {
    setGameData((prev) => ({ ...prev, [field]: value }));
  }
  function updateGameArrays({ field, value }) {
    setGameDataArrays((prev) => {
      const updatedArray = [
        ...prev[field].filter((item) => item.id !== value.id),
        value,
      ];

      return { ...prev, [field]: updatedArray };
    });
  }

  function createPeriod(newData) {
    newData = { game: gameId, ...newData };
    createData(
      {
        table: 'periods',
        newData,
        view: 'periods',
        toast: false,
      },
      {
        onSuccess: (data) => {
          updateGameArrays({ field: 'periods', value: data.data[0] });
        },
      }
    );
  }
  function updatePeriod(newData) {
    const id = gameData.currentPeriod.id;
    updateData(
      {
        table: 'periods',
        newData,
        id,
      },
      {
        onSuccess: (data) => {
          updateGameArrays({
            field: 'periods',
            value: data.data[0],
          });
        },
      }
    );
  }
  function deletePeriod() {
    const id = gameData.currentPeriod.id;
  }
  function createMinorEvent(data) {
    const { type, section } = data;
    const gameMinute = getGameTime.gameTime();
    const periodId = gameData.currentPeriod.id;

    setGameDataArrays((prev) => ({
      ...gameDataArrays,
      minorEvents: {
        ...prev.minorEvents,
        [section]: {
          ...prev.minorEvents[section],
          [type]: [
            ...prev.minorEvents[section][type],
            { gameMinute, eventType: type, team: section, periodId },
          ],
        },
      },
    }));
    const newData = {
      eventType: type,
      team: section,
      gameMinute,
      periodId,
    };
    createData({
      table: 'minorEvents',
      newData,
      toast: false,
    });
  }
  function updateMinorEvent(data) {}
  function deleteMinorEvent(data) {}
  function createStoppage(data) {
    const begin = getGameTime.gameTime();
    const clockStopped =
      Math.abs(gameDataArrays.game.gf - gameDataArrays.game.ga) < 5;
    //type is which kind of stopppage
    const status = {
      event: data,
      begin,
      periodId: gameData.currentPeriod.id,
      clockStopped,
    };

    createData(
      {
        table: 'stoppages',
        newData: status,
        toast: false,
      },
      {
        onSuccess: (data) =>
          updateGame({
            field: 'stoppageStatus',
            value: data.data[0],
          }),
      }
    );
  }
  function updateStoppage(newData, extraDetails) {
    const id = gameData.stoppageStatus.id;
    updateData(
      {
        table: 'stoppages',
        newData,
        id,
      },
      {
        onSuccess: (data) => {
          if (newData.event === 'Goal Scored')
            createData({
              table: 'goalsFor',
              newData: { eventId: data.data[0].id, ...extraDetails },
              toast: false,
            });

          if (newData.event === 'Goal Against')
            createData({
              table: 'goalsAgainst',
              newData: { eventId: data.data[0].id, ...extraDetails },
              toast: false,
            });
          //extraDetails runs only if there is a discpline or a goal
        },
      }
    );
  }
  function deleteStoppage() {
    const id = gameData.stoppageStatus.id;
    updateGame({ field: 'stoppageStatus', value: false });

    deleteData({
      table: 'stoppages',
      id,
      toast: false,
    });
  }
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
