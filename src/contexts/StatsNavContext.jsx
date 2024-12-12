import { createContext, useContext, useState } from 'react';
import Spinner from '../ui/Spinner';
import { useData } from '../services/useUniversal';

//if career, no grade, yearsPlayed
//if seasons, grade, season
//if all, grade, season
const allButtons = {
  sidebar: ['Individual', 'Team'],
  header: {
    Individual: ['Season', 'Career', 'All Games'],
    Team: ['Seasons'],
  },
};

const StatsNavContext = createContext();

function StatsNavContextProvider({ children }) {
  const playerStats = useData({ table: 'playerGames' });
  const playerSeasonStats = useData({ table: 'player_season_stats_view' });
  const playerCareerStats = useData({ table: 'player_career_stats_view' });
  const teamStats = useData({ table: 'season_stats_view' });

  const [active, setActive] = useState({
    primary: 'Individual',
    secondary: 'Career',
  });

  function handleToggle(e) {
    const [primary, secondary] = e.target.name.split('-');

    setActive({
      primary,
      secondary,
    });
  }
  if (
    playerStats.isLoading ||
    teamStats.isLoading ||
    playerSeasonStats.isLoading
  )
    return <Spinner />;

  return (
    <StatsNavContext.Provider
      value={{
        active,
        handleToggle,
        allButtons,
        playerStats: playerStats.data,
        teamStats: teamStats.data,
        playerSeasonStats: playerSeasonStats.data,
        playerCareerStats: playerCareerStats.data,
      }}
    >
      {children}
    </StatsNavContext.Provider>
  );
}
function useStatsNavContext() {
  const context = useContext(StatsNavContext);

  if (context === undefined)
    throw new Error('StatsNavContext was used outside of StatsNavProvider');

  return context;
}

export { StatsNavContextProvider, useStatsNavContext };
