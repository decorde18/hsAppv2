import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createEditPlayer } from '../../services/apiPlayers';

export function useEditPlayer() {
  const queryClient = useQueryClient();
  const { mutate: editPlayer, isLoading: isEditingPlayer } = useMutation({
    mutationFn: ({ newPlayerData, id }) => createEditPlayer(newPlayerData, id),
    onSuccess: () => {
      toast.success('New Player successfully edited');
      queryClient.invalidateQueries({ queries: ['players'] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isEditingPlayer, editPlayer };
}
