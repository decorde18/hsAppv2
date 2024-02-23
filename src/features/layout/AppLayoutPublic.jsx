import { Outlet } from 'react-router-dom';

import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import { useRecentSeason } from '../seasons/useSeasons';

function AppLayoutPublic() {
  const { currentSeason } = useCurrentSeason();
  const { isLoadingRecent } = useRecentSeason();

  if (isLoadingRecent || !currentSeason) return;

  return <Outlet />;
}

export default AppLayoutPublic;
