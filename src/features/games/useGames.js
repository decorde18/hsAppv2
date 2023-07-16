import { useQuery } from '@tanstack/react-query';
import { getGames, getGamesSeason } from '../../services/apiGames';

export function useGames() {
  const {
    isLoading: isLoadingGames,
    data: games,
    error,
  } = useQuery({ queryKey: ['games'], queryFn: getGames });

  return { isLoadingGames, error, games };
}

export function useGamesSeason(seasonId) {
  const {
    isLoading: isLoadingGamesSeason,
    data: gamesSeason,
    error,
  } = useQuery({
    queryKey: ['gamesSeason'],
    queryFn: () => (seasonId ? getGamesSeason(seasonId) : null),
  });
  return { isLoadingGamesSeason, error, gamesSeason };
}
