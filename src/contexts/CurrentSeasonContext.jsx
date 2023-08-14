import { createContext, useContext, useEffect } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

const CurrentSeasonContext = createContext();

function CurrentSeasonProvider({ children }) {
  const [currentSeason, setCurrentSeason] = useLocalStorageState(
    false,
    'currentSeason'
  );

  function updateCurrentSeason(season) {
    setCurrentSeason(season);
  }

  return (
    <CurrentSeasonContext.Provider
      value={{ currentSeason, updateCurrentSeason }}
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
