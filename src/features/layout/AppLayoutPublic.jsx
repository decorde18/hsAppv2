import { useEffect } from 'react';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import { useRecentSeason } from '../seasons/useSeasons';

function PublicPages() {
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
  return <div></div>;
}

export default PublicPages;
