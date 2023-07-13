import { useQuery } from '@tanstack/react-query';
import { getGames } from '../../services/apiGames';

export function useGames() {
  const {
    isLoading: isLoadingGames,
    data: games,
    error,
  } = useQuery({ queryKey: ['games'], queryFn: getGames });

  return { isLoadingGames, error, games };
}
