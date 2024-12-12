import { useStatsNavContext } from '../../contexts/StatsNavContext';
import TableWithFeatures from '../../ui/TableWithFeatures';

const headers = [
  {
    label: 'Player',
    key: 'fullnamelast',
    width: 15,
    type: ['season', 'career', 'all'],
  },
  { label: 'Season', key: 'season', width: 5, type: ['season', 'all'] },
  {
    label: 'Starts',
    key: 'starter',
    width: 5,
    type: ['season', 'career', 'all'],
  },
  { label: 'Played', key: 'gp', width: 5, type: ['season', 'career', 'all'] },
  {
    label: 'Dressed',
    key: 'dressed',
    width: 5,
    type: ['season', 'career', 'all'],
  },
  {
    label: 'Injured',
    key: 'injured',
    width: 5,
    type: ['season', 'career', 'all'],
  },
  { label: 'G', key: 'goals', width: 5, type: ['season', 'career', 'all'] },
  { label: 'A', key: 'assists', width: 5, type: ['season', 'career', 'all'] },
  {
    label: 'Shots',
    key: 'shots',
    width: 5,
    type: ['season', 'career', 'all'],
  },
  {
    label: 'GA',
    key: 'goals_against',
    width: 5,
    type: ['season', 'career', 'all'],
  },
  {
    label: 'Saves',
    key: 'saves',
    width: 5,
    type: ['season', 'career', 'all'],
  },
  // { label: '', key: '', width: 5 },

  // {
  //   label: '',
  //   columns: [{ label: '', key: '' , width: 5 }],
  // },
  // { label: '', columns: { label: '', key: '', width: 5  } },
  // { label: '', key: '', width: 5  },
];
const season = headers.filter((header) => header.type.includes('season'));
const career = headers.filter((header) => header.type.includes('career'));
const allGames = headers.filter((header) => header.type.includes('all'));
function PlayerStats() {
  const { playerSeasonStats, playerStats, playerCareerStats, active } =
    useStatsNavContext();

  return (
    <>
      {(() => {
        switch (active.secondary) {
          case 'Career':
            return (
              <TableWithFeatures
                key="individual-career"
                headers={career}
                data={playerCareerStats}
                rowsPerPage={20}
              />
            );
          case 'Season':
            return (
              <TableWithFeatures
                key="individual-season"
                headers={season}
                data={playerSeasonStats}
                rowsPerPage={20}
              />
            );
          case 'All Games':
            return (
              <TableWithFeatures
                key="individual-all"
                headers={allGames}
                data={playerStats}
                rowsPerPage={20}
              />
            );
          default:
            return <div />;
        }
      })()}
    </>
  );
}

export default PlayerStats;
