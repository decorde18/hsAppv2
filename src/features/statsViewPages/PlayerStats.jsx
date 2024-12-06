import { useStatsNavContext } from '../../contexts/StatsNavContext';

function PlayerStats() {
  const { PlayerStats } = useStatsNavContext();

  return <div>Player Stats</div>;
}

export default PlayerStats;
