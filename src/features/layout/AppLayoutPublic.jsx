import { useEffect } from 'react';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import { useRecentSeason } from '../seasons/useSeasons';
import Logo from '../../ui/Logo';
import Spinner from '../../ui/Spinner';

function AppLayoutPublic({ logo, children }) {
  // ON LOAD  UPDATE THE RECENT AND CURRENT IN LOCAL AND CONTEXT PROVIDER
  const { currentSeason, updateCurrentSeason, updateRecentSeason } =
    useCurrentSeason();
  const { isLoadingRecent, recentSeason } = useRecentSeason();

  useEffect(
    function () {
      if (isLoadingRecent) return;
      updateRecentSeason(recentSeason.id);
      if (!currentSeason) updateCurrentSeason(recentSeason.id);
    },
    [
      currentSeason,
      updateCurrentSeason,
      recentSeason,
      updateRecentSeason,
      isLoadingRecent,
    ]
  );
  if (isLoadingRecent || !currentSeason) return <Spinner />;
  return (
    <>
      <div>{logo && <Logo />}</div>
      {children}
    </>
  );
}

export default AppLayoutPublic;
