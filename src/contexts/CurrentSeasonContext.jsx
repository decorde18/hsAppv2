import { createContext, useContext } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

const CurrentSeasonContext = createContext();

function CurrentSeasonProvider({ children }) {
  //The recent is set to current in AppLayoutPublic
  const [currentSeason, setCurrentSeason] = useLocalStorageState(
    false,
    'currentSeason'
  );
  const [recentSeason, setRecentSeason] = useLocalStorageState(
    false,
    'recentSeason'
  );

  function updateCurrentSeason(season) {
    setCurrentSeason(season);
  }
  function updateRecentSeason(season) {
    setRecentSeason(season);
  }
  return (
    <CurrentSeasonContext.Provider
      value={{
        currentSeason,
        updateCurrentSeason,
        recentSeason,
        updateRecentSeason,
      }}
    >
      {children}
    </CurrentSeasonContext.Provider>
  );
}

function useCurrentSeason() {
  const context = useContext(CurrentSeasonContext);
  if (context === undefined)
    throw new Error(
      'CurrentSeasonContext was used outside of CurrentSeasonProvider'
    );

  return context;
}

export { CurrentSeasonProvider, useCurrentSeason };
