import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getParents,
  createEditParent,
  createEditPlayerParent,
  getPlayerParents,
} from '../../services/apiParents';
import { toast } from 'react-hot-toast';

export function useParents() {
  const {
    //destructure has plenty of other useful values ie status console.log this query to see the different ones
    isLoading: isLoadingParents,
    data: parents,
    error,
  } = useQuery({ queryKey: ['parents'], queryFn: getParents });
  return { isLoadingParents, error, parents };
}

export function useCreateParent() {
  const queryClient = useQueryClient();
  const { mutate: createParent, isLoading: isCreating } = useMutation({
    mutationFn: createEditParent,
    onSuccess: () => {
      // toast.success('New Parent successfully created');
      queryClient.invalidateQueries({ queries: ['parents'] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { createParent, isCreating };
}
export function useGetPlayerParents() {
  const {
    isLoading: isLoadingPlayerParents,
    data: playerParents,
    error,
  } = useQuery({
    queryKey: ['playerParents'],
    queryFn: getPlayerParents,
    onError: (err) => toast.error(err.message),
  });

  return { isLoadingPlayerParents, playerParents };
}
export function useCreatePlayerParent() {
  const queryClient = useQueryClient();
  const { mutate: createPlayerParent, isLoading: isCreatingPlayerParent } =
    useMutation({
      mutationFn: createEditPlayerParent,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queries: ['playerParents', 'players', 'parents'],
        });
      },
      onError: (err) => toast.error(err.message),
    });
  return { createPlayerParent, isCreatingPlayerParent };
}
