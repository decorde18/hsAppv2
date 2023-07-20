import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  updatePlayerSeason,
  createPlayerSeasons,
} from '../../services/apiPlayers';

export function useUpdatePlayerSeason() {
  const queryClient = useQueryClient();
  const { mutate: updateSetting, isLoading: isUpdating } = useMutation({
    mutationFn: updatePlayerSeason,
    onSuccess: () => {
      toast.success('Setting successfully edited');
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
