import { useStatsNavContext } from '../../contexts/StatsNavContext';
import PlayerStats from './PlayerStats';
import TeamStats from './TeamStats';

function StatsPagePicker() {
  const { active } = useStatsNavContext();
  return (
    <>
      {(() => {
        switch (active) {
          case 'Team':
            return <TeamStats />;
          default:
            return <PlayerStats />;
        }
      })()}
    </>
  );
}

export default StatsPagePicker;
