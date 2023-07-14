import { useQuery } from '@tanstack/react-query';
import { getRecentSeason, getSeasons } from '../../services/apiSeasons';

export function useSeasons() {
  const {
    //destructure has plenty of other useful values ie status console.log this query to see the different ones
    isLoading: isLoadingSeasons,
    data: seasons,
    error,
  } = useQuery({ queryKey: ['seasons'], queryFn: getSeasons });

  return { isLoadingSeasons, error, seasons };
}
export function useRecentSeason() {
  const {
    isLoading: isLoadingRecent,
    data,
    error,
  } = useQuery({ queryKey: ['recentSeasons'], queryFn: getRecentSeason });
  const [recentSeason] = data ? data : [];
  return { isLoadingRecent, error, recentSeason };
}
