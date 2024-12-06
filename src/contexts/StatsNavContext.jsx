import { createContext, useContext, useState } from 'react';
import Spinner from '../ui/Spinner';
import { useData } from '../services/useUniversal';

const headers = [
  { label: 'Season', key: 'season', width: 10 },
  {
    label: 'Overall',
    columns: [
      { label: 'W', key: 'wins', width: 5 },
      { label: 'L', key: 'losses', width: 5 },
      { label: 'T', key: 'ties', width: 5 },
      { label: '%', key: 'overallpercent', type: 'percent', width: 5 },
      { label: 'GF', key: 'gf', width: 5 },
      { label: 'GA', key: 'ga', width: 5 },
    ],
  },
  {
    label: 'District',
    columns: [
      { label: 'W', key: 'distwins', width: 5 },
      { label: 'L', key: 'distlosses', width: 5 },
      { label: 'T', key: 'distties', width: 5 },
      { label: '%', key: 'distpercent', type: 'percent', width: 5 },
    ],
  },
  {
    label: 'PostSeason',
    columns: [
      { label: 'W', key: 'postwins', width: 5 },
      { label: 'L', key: 'postlosses', width: 5 },
      { label: '%', key: 'postpercent', type: 'percent', width: 5 },
    ],
  },
  {
    label: 'Home',
    columns: [
      { label: 'W', key: 'homewins', width: 5 },
      { label: 'L', key: 'homelosses', width: 5 },
      { label: 'T', key: 'hometies', width: 5 },
      { label: '%', key: 'homepercent', type: 'percent', width: 5 },
    ],
  },
  // {
  //   label: '',
  //   columns: [{ label: '', key: '' , width: 0.2 }],
  // },
  // { label: '', columns: { label: '', key: '', width: 0.2  } },
  // { label: '', key: '', width: 0.2  },
];
const columns = {
  team: [
    {
      column: 'overall',
      label: 'W',
      value: 'wins',
    },
    { column: 'overall', value: 'losses', label: 'l' },
    { column: 'overall', value: 'ties', label: 't' },
    {
      column: 'overall',
      value: 'percent',
      label: 'overallpercent',
    },
    { column: 'goalsScored', value: 'gf', label: 'gf' },
    { column: 'goalsScored', value: 'ga', label: 'ga' },
    {
      column: 'district',
      label: 'W',
      value: 'districtwins',
    },
    { column: 'district', value: 'districtlosses', label: 'l' },
    { column: 'district', value: 'districtties', label: 't' },
    {
      column: 'district',
      label: 'percent',
      value: 'distPercent',
    },
    {
      column: 'post',
      label: 'W',
      value: 'postwins',
    },
    { column: 'post', value: 'postlosses', label: 'l' },
    {
      column: 'post',
      value: 'percent',
      label: 'postPercent',
    },
    {
      column: 'home',
      label: 'W',
      value: 'homewins',
    },
    { column: 'home', value: 'homelosses', label: 'l' },
    { column: 'home', value: 'hometies', label: 't' },
    {
      column: 'home',
      value: 'percent',
      label: 'homePercent',
    },
  ],
  player: [
    {
      label: 'Years Played',
      width: '',
      field: '',
      isSearchable: true,
      defaultSortDirection: true,
      sort: true,
      sortPriority: 1,
      type: 'string',
      displayedOn: ['career'],
    },
  ],
};

//if career, no grade, yearsPlayed
//if seasons, grade, season
//if all, grade, season
const allButtons = {
  sidebar: ['Individual', 'Team'],
  header: ['Season', 'Career', 'All Seasons'],
};

const StatsNavContext = createContext();

function StatsNavContextProvider({ children }) {
  const playerStats = useData({ view: 'stats_by_player_game_view' });
  const teamStats = useData({ view: 'season_stats_view' });

  const [active, setActive] = useState(allButtons.sidebar[0]);
  function handleToggle(e) {
    setActive(e.target.name);
  }
  if (playerStats.isLoading || teamStats.isLoading) return <Spinner />;
  return (
    <StatsNavContext.Provider
      value={{
        active,
        handleToggle,
        headers,
        columns,
        allButtons,
        playerStats: playerStats.data,
        teamStats: teamStats.data,
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
