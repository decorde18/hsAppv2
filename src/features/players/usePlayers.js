import { useQuery } from '@tanstack/react-query';
import { getPlayerSeasons, getPlayers } from '../../services/apiPlayers';

export function usePlayers() {
  const {
    //destructure has plenty of other useful values ie status console.log this query to see the different ones
    isLoading: isLoadingPlayers,
    data: players,
    error,
  } = useQuery({ queryKey: ['players'], queryFn: getPlayers });
  return { isLoadingPlayers, error, players };
}
export function usePlayerSeasons() {
  const {
    //destructure has plenty of other useful values ie status console.log this query to see the different ones
    isLoading: isLoadingPlayerSeasons,
    data: playerSeasons,
    error,
  } = useQuery({ queryKey: ['playerSeasons'], queryFn: getPlayerSeasons });
  return { isLoadingPlayerSeasons, error, playerSeasons };
}
