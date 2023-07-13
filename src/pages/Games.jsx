import { useOutletContext } from 'react-router-dom';
import GameTable from '../features/games/GameTable';

function Games() {
  const [seasonProps] = useOutletContext();
  return (
    <div>
      <GameTable seasonProps={seasonProps} />
    </div>
  );
}
export default Games;
