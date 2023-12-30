import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createEditPlayer } from '../../services/apiPlayers';

export function useCreatePlayer() {
  const queryClient = useQueryClient();
  const { mutate: createPlayer, isLoading: isCreating } = useMutation({
    mutationFn: createEditPlayer,
    onSuccess: () => {
      // toast.success('New Player successfully created');
      queryClient.invalidateQueries({ queries: ['players'] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { createPlayer, isCreating };
}
