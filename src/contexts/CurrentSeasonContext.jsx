import { createContext, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { useRecentSeason } from '../features/seasons/useSeasons';

const CurrentSeasonContext = createContext();

function CurrentSeasonProvider({ children }) {
  const { isLoadingRecent, recentSeason: recent } = useRecentSeason();
  const [currentSeason, setCurrentSeason] = useLocalStorageState(
    null,
    'currentSeason'
  );
  const [recentSeason, setRecentSeason] = useLocalStorageState(
    false,
    'recentSeason'
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const curSeason = +searchParams.get('season');

  useEffect(() => {
    if (isLoadingRecent) return;
    if (!recentSeason) updateRecentSeason(recent.id);
    if (curSeason === 0 || !currentSeason) updateCurrentSeason(recent.id);
    if (curSeason > 0 && curSeason !== currentSeason)
      updateCurrentSeason(curSeason);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curSeason, isLoadingRecent]);

  function updateCurrentSeason(season) {
    searchParams.set('season', season);
    setSearchParams(searchParams);
    setCurrentSeason(season);
  }
  function updateRecentSeason(season) {
    setRecentSeason(season);
  }
  if (isLoadingRecent) return;
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
