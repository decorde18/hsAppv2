import { useOutletContext } from 'react-router-dom';
import PlayerTable from '../features/players/PlayerTable';

function Players() {
  return (
    <div>
      <PlayerTable />
    </div>
  );
}

export default Players;
