import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  getPlayerSeason,
  getPlayerSeasons,
  updatePlayerSeason,
  createPlayerSeasons,
} from '../../services/apiPlayers';

export function usePlayerSeasons() {
  const {
    isLoading: isLoadingPlayerSeasons,
    data: playerSeasons,
    error,
  } = useQuery({ queryKey: ['playerSeasons'], queryFn: getPlayerSeasons });
  return { isLoadingPlayerSeasons, error, playerSeasons };
}
export function usePlayerSeason(seasonId) {
  const {
    isLoading: isLoadingPlayerSeason,
    data: playerSeason,
    error,
  } = useQuery({
    queryKey: ['playerSeason'],
    queryFn: () => getPlayerSeason(seasonId),
  });
  return { isLoadingPlayerSeason, error, playerSeason };
}

export function useUpdatePlayerSeason() {
  const queryClient = useQueryClient();
  const { mutate: updateSetting, isLoading: isUpdating } = useMutation({
    mutationFn: updatePlayerSeason,
    onSuccess: () => {
      toast.success('Successfully edited');
      queryClient.invalidateQueries({ queries: ['settings'] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isUpdating, updateSetting };
}

export function useCreatePlayerSeason() {
  const queryClient = useQueryClient();
  const { mutate: createPlayerSeason, isLoading: isCreatingPlayerSeason } =
    useMutation({
      mutationFn: createPlayerSeasons,
      onSuccess: () => {
        toast.success('New Player Season successfully created');
        queryClient.invalidateQueries({
          queries: ['playerSeasons', 'players'],
        });
      },
      onError: (err) => toast.error(err.message),
    });

  return { createPlayerSeason, isCreatingPlayerSeason };
}
