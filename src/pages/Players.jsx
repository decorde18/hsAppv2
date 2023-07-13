import { useOutletContext } from 'react-router-dom';
import PlayerTable from '../features/players/PlayerTable';

function Players() {
  const [seasonProps] = useOutletContext();
  return (
    <div>
      <PlayerTable seasonProps={seasonProps} />
    </div>
  );
}

export default Players;
