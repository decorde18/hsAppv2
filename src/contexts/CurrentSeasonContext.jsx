import { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { useRecentSeason } from '../features/seasons/useSeasons';
import { useData } from '../services/useUniversal';
import Spinner from '../ui/Spinner';

const CurrentSeasonContext = createContext();

function CurrentSeasonProvider({ children }) {
  //get all seasons
  const { isLoading, data: seasons } = useData({
    table: 'seasons',
    sort: [{ field: 'season', direction: false }],
  });
  const [currentSeasonNew, setCurrentSeasonNew] = useState();
  const [recentSeasonNew, setRecentSeasonNew] = useState();

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

  useEffect(() => {
    if (isLoading) return;
    const recent = seasons[0];
    const current = seasons.find((season) => season.id === +currentSeason);
    //get recent season from API
    setRecentSeasonNew(recent);
    //if current season is stored locally, use it
    setCurrentSeasonNew(
      currentSeason
        ? current
        : //set the current season to the recent season if not already stored locally
          recent
    );
    //set local variables
    updateCurrentSeason(current.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSeason, isLoading, seasons, setRecentSeason]);

  function updateCurrentSeason(season) {
    searchParams.set('season', season);
    setSearchParams(searchParams);
    setCurrentSeason(season);
  }
  function updateRecentSeason(season) {
    setRecentSeason(season);
  }
  if (isLoadingRecent || isLoading) return <Spinner />;

  return (
    <CurrentSeasonContext.Provider
      value={{
        currentSeason,
        updateCurrentSeason,
        recentSeason,
        updateRecentSeason,
        seasons,
        recentSeasonNew,
        currentSeasonNew,
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
