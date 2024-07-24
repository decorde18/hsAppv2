import { useSearchParams } from 'react-router-dom';

import { useData } from '../services/useUniversal';
import { useEffect, useState, createContext, useContext } from 'react';

import {
  converthmsToSecondsOnly,
  getCurrentTime,
  subtractTime,
} from '../utils/helpers';
import ModalStoppages from '../ui/ModalStoppages';

const meCategories = {
  for: { foul: [], corner: [], offside: [], shots: [] },
  against: { foul: [], corner: [], offside: [], shots: [] },
};

const GameContext = createContext();

function GameContextProvider({ children }) {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');

  const [currentPeriod, setCurrentPeriod] = useState();
  const [gameData, setGameData] = useState();
  const [minorEventCategories, setMinorEventCategories] =
    useState(meCategories);
  const [modalOpen, setModalOpen] = useState(true);

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
  const subTotals = useData({
    table: 'subs',
    filter: [{ field: 'game', value: gameId }],
  });
  const subs = useData({
    table: 'sub',
    filter: [{ field: 'game', value: gameId }],
  });
  useEffect(() => {
    //setgameData
    if (!game.data) return;
    setGameData(() => game.data[0]);
  }, [game.data]);
  useEffect(() => {
    //set current period
    if (!periods.data) return;
    setCurrentPeriod(periods.data.sort((a, b) => b.period - a.period)[0]);
  }, [periods]);
  useEffect(() => {
    //updateminorEventsCategories
    if (!minorEvents.data) return;
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
  }, [minorEvents.data]);

  function getGameTime() {
    return (
      (converthmsToSecondsOnly(game.actualgametime) || 0) +
      (currentPeriod?.end
        ? 0
        : subtractTime(currentPeriod.start, getCurrentTime()))
    );
  }
  if (
    periods.isLoading ||
    minorEvents.isLoading ||
    game.isLoading ||
    subTotals.isLoading ||
    subs.isLoading ||
    !gameData
  )
    return;

  return (
    <GameContext.Provider
      value={{
        periods: periods.data,
        currentPeriod,
        game: gameData,
        minorEventCategories,
        getGameTime,
        setGameData,
        setCurrentPeriod,
        setMinorEventCategories,
        subTotals: subTotals.data,
        subs: subs.data,
        modalOpen,
        setModalOpen,
      }}
    >
      {modalOpen ? <ModalStoppages>{children}</ModalStoppages> : children}
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