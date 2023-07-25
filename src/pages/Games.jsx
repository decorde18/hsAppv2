import { useOutletContext } from 'react-router-dom';
import GameTable from '../features/games/GameTable';

function Games() {
  return (
    <div>
      <GameTable />
    </div>
  );
}
export default Games;
