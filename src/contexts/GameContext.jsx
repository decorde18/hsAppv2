import { useSearchParams } from 'react-router-dom';

import { useData } from '../services/useUniversal';
import { useEffect, useState, createContext, useContext } from 'react';

import {
  converthmsToSecondsOnly,
  getCurrentTime,
  subtractTime,
} from '../utils/helpers';
import ModalGames from '../features/games/gameStatsEntry/modalGames/ModalGames';

const meCategories = {
  for: { foul: [], corner: [], offside: [], shots: [] },
  against: { foul: [], corner: [], offside: [], shots: [] },
};
const buttons = [
  { id: 1, type: 'foul', section: 'for' },
  { id: 2, type: 'offside', section: 'for' },
  { id: 3, type: 'corner', section: 'for' },
  { id: 4, type: 'shots', section: 'for' },
  { id: 5, type: 'foul', section: 'against' },
  { id: 6, type: 'offside', section: 'against' },
  { id: 7, type: 'corner', section: 'against' },
  { id: 8, type: 'shots', section: 'against' },
  { id: 9, type: 'goal', section: 'stoppage' },
  { id: 10, type: 'discipline', section: 'stoppage' },
  { id: 11, type: 'injury', section: 'stoppage' },
  { id: 12, type: 'other', section: 'stoppage' },
];

const GameContext = createContext();

function GameContextProvider({ children }) {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');
  const [gameDetails, setGameDetails] = useState({
    gameId,
    currentPeriod: 0,
    periods: [],
    minorEventCategories: [],
    stoppages: [],
    subs: [],
    subTotals: [],
    gameStatus: 'periodActive',
  });

  const [currentPeriod, setCurrentPeriod] = useState();
  const [gameData, setGameData] = useState();
  const [minorEventCategories, setMinorEventCategories] =
    useState(meCategories);
  const [gameStatus, setGameStatus] = useState();

  const game = useData({
    table: 'games',
    filter: [{ field: 'id', value: gameId, table: 'games' }],
  });
  const periods = useData({
    table: 'periods',
    filter: [{ field: 'game', value: gameId }],
  });
  const minorEvents = useData({
    table: 'minorEvents',
    filter: [{ field: 'game', value: gameId }],
  });
  const stoppages = useData({
    table: 'stoppages',
    filter: [{ field: 'game', value: gameId }],
  });
  const subTotals = useData({
    table: 'subs',
    filter: [{ field: 'game', value: gameId }],
  });
  const subs = useData({
    table: 'sub',
    filter: [{ field: 'game', value: gameId }],
  });

  const isWorking =
    subs.isLoading ||
    subTotals.isLoading ||
    stoppages.isLoading ||
    minorEvents.isLoading ||
    periods.isLoading ||
    game.isLoading;

  //set gameStatus - before Game, during gae, between period, end of game - also if inside a stoppage
  useEffect(() => {
    if (isWorking) return;
    const current = periods.data.sort((a, b) => b.period - a.period)[0];
    const noOfPeriods =
      game.data[0].reg_periods +
      (game.data[0].ot_if_tied && game.data[0].max_ot_periods);

    let status = 'periodActive';

    if (!current?.start) status = 'beforeGame';
    if (current?.start && current?.end)
      if (current.period === noOfPeriods) status = 'endGame';
      else status = 'betweenPeriods';
    if (stoppages.data?.some((stoppage) => !stoppage.end))
      setGameDetails(
        () => stoppages.data.find((stoppage) => !stoppage.end).event
      );

    setGameDetails({
      ...gameDetails,
      subs: subs.data,
      subTotals: subTotals.data,
      stoppages: stoppages.data,
      stoppageStatus: stoppages.data.find((stoppage) => !stoppage.end) || false,
      minorEvents: minorEvents.data,
      periods: periods.data,
      game: game.data[0],
      gameStatus: status,
      minorEventCategories: Object.keys(meCategories)
        .map((team) => ({
          //cycle through each category team
          [team]: Object.keys(meCategories[team]) //add to an object
            .map((eventType) => ({
              //cycle through each category iitemType
              [eventType]: minorEvents.data.filter(
                //add to an object
                (each) => each.team === team && each.eventType === eventType
              ),
            }))
            .reduce((acc, item) => ({ ...acc, ...item }), {}), //convert itemType array to object
        }))
        .reduce((acc, item) => ({ ...acc, ...item }), {}),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWorking]);
  //setgameData
  useEffect(() => {
    if (!game.data) return;
    setGameData(() => game.data[0]);
  }, [game.data]);
  //set current period
  useEffect(() => {
    if (game.isLoading) return;
    if (periods.isLoading) return;
    if (stoppages.isLoading) return;
    const current = periods.data.sort((a, b) => b.period - a.period)[0];
    setCurrentPeriod(() => current);
    // setGameDetails((g) => ({ ...g, currentPeriod: current }));
  }, [game, periods, stoppages]);
  //todo set Gamedetails. is this repetitive? the useEffect above may be doing the same thing
  useEffect(() => {
    if (!currentPeriod) return;
    if (gameStatus) return;
    const noOfPeriods =
      game.data[0].reg_periods +
      (game.data[0].ot_if_tied && game.data[0].max_ot_periods);

    let status = 'periodActive';

    if (!currentPeriod?.start) status = 'beforeGame';
    if (currentPeriod?.start && currentPeriod?.end)
      if (currentPeriod.period === noOfPeriods) status = 'endGame';
      else status = 'betweenPeriods';

    setGameStatus(status);
    setGameDetails((g) => ({ ...g, currentPeriod }));
  }, [currentPeriod, game.data, gameStatus]);
  //updateminorEventsCategories
  useEffect(() => {
    if (!minorEvents.data) return;
    setGameDetails({
      ...gameDetails,
      minorEventCategories: Object.keys(meCategories)
        .map((team) => ({
          //cycle through each category team
          [team]: Object.keys(meCategories[team]) //add to an object
            .map((eventType) => ({
              //cycle through each category iitemType
              [eventType]: minorEvents.data.filter(
                //add to an object
                (each) => each.team === team && each.eventType === eventType
              ),
            }))
            .reduce((acc, item) => ({ ...acc, ...item }), {}), //convert itemType array to object
        }))
        .reduce((acc, item) => ({ ...acc, ...item }), {}),
    });
    setMinorEventCategories(
      Object.keys(meCategories)
        .map((team) => ({
          //cycle through each category team
          [team]: Object.keys(meCategories[team]) //add to an object
            .map((eventType) => ({
              //cycle through each category iitemType
              [eventType]: minorEvents.data.filter(
                //add to an object
                (each) => each.team === team && each.eventType === eventType
              ),
            }))
            .reduce((acc, item) => ({ ...acc, ...item }), {}), //convert itemType array to object
        }))
        .reduce((acc, item) => ({ ...acc, ...item }), {})
    ); //convert team array to object

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minorEvents.data]);

  function getGameTime() {
    // todo on new period, setCurrentPeriod needs to be updated
    //TODO gametime and elapsedgamtime/truegamtime/modifiedgametime, somehting, need to be adjusted to include clockStopped
    /* the gametime is only for saving the minute entered for start, end, subin/out */

    return (
      periods.data
        .filter((period) => period.end && period.start)
        .reduce((acc, period) => {
          return (acc = acc + subtractTime(period.start, period.end));
        }, 0) +
      (currentPeriod.start && !currentPeriod.end
        ? subtractTime(currentPeriod.start, getCurrentTime())
        : 0)
    );
    // ? subtractTime(currentPeriod?.start, getCurrentTime())
    // return (
    //   (converthmsToSecondsOnly(game.actualgametime) || 0) +
    //   (currentPeriod?.end
    //     ? 0
    //     : subtractTime(currentPeriod?.start, getCurrentTime()))
    // );
  }

  if (isWorking || !gameDetails.game) return;

  return (
    <GameContext.Provider
      value={{
        getGameTime,
        gameDetails,
        setGameDetails,
        buttons,
        currentPeriod,
        setCurrentPeriod,
        gameStatus,
        setGameStatus,
        minorEventCategories,
        setMinorEventCategories,
      }}
      // value={{gamedetails:{gameDetails, setGameDetails},
      // currentPeriod:{currentPeriod,setCurrentPeriod},
      // gameStatus:{gameStatus, setGameStatus},
      // minorEventCategories:{minorEventCategories, setMinorEventCategories},
      //   getGameTime,
      //   buttons,

      // }}
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
