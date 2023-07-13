import { useQuery } from '@tanstack/react-query';
import { getSeasons, getRecentSeason } from '../../services/apiSeasons';

export function useSeasons() {
  const {
    //destructure has plenty of other useful values ie status console.log this query to see the different ones
    isLoading,
    data: seasons,
    error,
  } = useQuery({ queryKey: ['seasons'], queryFn: getSeasons });

  return { isLoading, error, seasons };
}
export function useRecentSeason() {
  const {
    isLoading: isLoadingRecent,
    data: recentSeason,
    error,
  } = useQuery({ queryKey: ['recentSeasons'], queryFn: getRecentSeason });
  return { isLoadingRecent, error, recentSeason };
}
