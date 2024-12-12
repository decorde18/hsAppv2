import { useStatsNavContext } from '../../contexts/StatsNavContext';
import TableWithFeatures from '../../ui/TableWithFeatures';
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
function TeamStats() {
  const { teamStats } = useStatsNavContext();
  return (
    <TableWithFeatures
      key="team-seasons"
      headers={headers}
      data={teamStats}
      rowsPerPage={15}
    />
  );
}

export default TeamStats;
