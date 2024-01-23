import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  getSub,
  getSubs,
  createEditSub,
  deleteSubApi,
} from '../../../services/apiSubs';
import { useSearchParams } from 'react-router-dom';

export function useSubs() {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');

  const {
    isLoading: isLoadingSubs,
    data: subs,
    error,
  } = useQuery({
    queryKey: ['subs', 'periods', 'games'],
    queryFn: () => getSub(gameId),
  });
  return { isLoadingSubs, subs };
}

export function useUpdateSub() {
  const queryClient = useQueryClient();
  const { mutate: updateSubs, isLoading: isUpdatingSub } = useMutation({
    mutationFn: createEditSub,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queries: ['subs', 'periods', 'games'],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isUpdatingSub, updateSubs };
}

export function useCreateSub() {
  const queryClient = useQueryClient();
  const { mutate: createSub, isLoading: isCreatingSub } = useMutation({
    mutationFn: createEditSub,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queries: ['subs', 'periods', 'games'],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { createSub, isCreatingSub };
}

export function useDeleteSub() {
  const queryClient = useQueryClient();
  const { isLoading: isDeletingSub, mutate: deleteSub } = useMutation({
    mutationFn: deleteSubApi,
    onSuccess: () => {
      toast.success(`Minor Event successfully deleted`);
      queryClient.invalidateQueries({
        queryKey: ['subs', 'periods', 'games'],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isDeletingSub, deleteSub };
}
