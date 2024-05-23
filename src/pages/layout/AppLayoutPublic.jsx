import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

import { Outlet } from 'react-router-dom';
import Spinner from '../../ui/Spinner';

function AppLayoutPublic() {
  const { currentSeason } = useCurrentSeason();
  if (!currentSeason) return <Spinner />;
  return <Outlet />;
}

export default AppLayoutPublic;
