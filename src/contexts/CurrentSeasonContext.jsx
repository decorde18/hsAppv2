import { createContext, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useLocalStorageState } from '../hooks/useLocalStorageState';

import { useData } from '../services/useUniversal';

import Spinner from '../ui/Spinner';

const CurrentSeasonContext = createContext();

function CurrentSeasonProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const curSeason = +searchParams.get('season');

  //get all seasons
  const { isLoading, data: seasons } = useData({
    table: 'seasons',
    sort: [{ field: 'season', direction: false }],
  });

  const [currentSeason, setCurrentSeason] = useLocalStorageState(
    null,
    'currentSeason'
  );
  const [recentSeason, setRecentSeason] = useLocalStorageState(
    false,
    'recentSeason'
  );

  useEffect(() => {
    if (!seasons) return;
    //update Current Season
    updateCurrentSeason(curSeason ? +curSeason : seasons[0].id);
    //update Recent Season
    updateRecentSeason(seasons[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seasons, curSeason]);

  function updateCurrentSeason(seasonId) {
    setSearchParams(searchParams);
    searchParams.set('season', seasonId);
    setCurrentSeason(
      seasons.find((season) => season.id === +seasonId) || recentSeason
    );
  }
  function updateRecentSeason(season) {
    setRecentSeason(season);
  }

  if (!currentSeason || !recentSeason || isLoading) return <Spinner />;
  return (
    <CurrentSeasonContext.Provider
      value={{
        currentSeason,
        updateCurrentSeason,
        recentSeason,
        updateRecentSeason,
        seasons,
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
