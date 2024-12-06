import { useStatsNavContext } from '../../contexts/StatsNavContext';
import TableWithFeatures from '../../ui/TableWithFeatures';

function TeamStats() {
  const { teamStats, headers } = useStatsNavContext();
  return (
    <TableWithFeatures headers={headers} data={teamStats} rowsPerPage={20} />
  );
}

export default TeamStats;
