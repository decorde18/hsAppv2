import { createContext, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { useData } from '../services/useUniversal';

// Create a context for the current season
const CurrentSeasonContext = createContext();

function CurrentSeasonProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const curSeason = +searchParams.get('season'); // Get current season from URL search parameters

  // Fetch database defaults and all seasons
  const { isLoading: isLoadingDb, data: dbDefaults } = useData({
    table: 'dbDefaults',
  });
  const { isLoading, data: seasons } = useData({
    table: 'seasons',
    sort: [{ field: 'season', direction: false }],
  });

  // Local storage state for current and recent seasons
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
    updateCurrentSeason(curSeason ? +curSeason : seasons[0].id);
    updateRecentSeason(seasons[0]);
  }, [seasons, curSeason]);

  // Update current season based on season ID
  function updateCurrentSeason(seasonId) {
    searchParams.set('season', seasonId);
    setSearchParams(searchParams); // Update URL search parameters
    setCurrentSeason(
      seasons.find((season) => season.id === +seasonId) || recentSeason
    );
  }

  // Update the most recent season
  function updateRecentSeason(season) {
    setRecentSeason(season);
  }

  // Return loading or error states if necessary data is not available
  if (
    !currentSeason ||
    !recentSeason ||
    isLoading ||
    isLoadingDb ||
    !dbDefaults
  )
    return null;

  const defaultTeam = dbDefaults[0]; // Default team from database defaults

  return (
    <CurrentSeasonContext.Provider
      value={{
        currentSeason,
        updateCurrentSeason,
        recentSeason,
        updateRecentSeason,
        seasons,
        defaultTeam,
      }}
    >
      {children}
    </CurrentSeasonContext.Provider>
  );
}

// Custom hook to use the current season context
function useCurrentSeason() {
  const context = useContext(CurrentSeasonContext);
  if (context === undefined) {
    throw new Error(
      'useCurrentSeason must be used within a CurrentSeasonProvider'
    );
  }
  return context;
}

export { CurrentSeasonProvider, useCurrentSeason };
