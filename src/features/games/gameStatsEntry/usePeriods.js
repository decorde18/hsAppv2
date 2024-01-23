import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  getPeriod,
  getPeriods,
  createEditPeriod,
  deletePeriodApi,
} from '../../../services/apiPeriods';
import { useSearchParams } from 'react-router-dom';

export function usePeriods() {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');

  const {
    isLoading: isLoadingPeriods,
    data: periods,
    error,
  } = useQuery({
    queryKey: ['periods', 'games'],
    queryFn: () => getPeriod(gameId),
  });
  return { isLoadingPeriods, periods };
}

export function useUpdatePeriod() {
  const queryClient = useQueryClient();
  const { mutate: updatePeriods, isLoading: isUpdatingPeriod } = useMutation({
    mutationFn: createEditPeriod,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queries: ['periods', 'games'],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isUpdatingPeriod, updatePeriods };
}

export function useCreatePeriod() {
  const queryClient = useQueryClient();
  const { mutate: createPeriod, isLoading: isCreatingPeriod } = useMutation({
    mutationFn: createEditPeriod,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queries: ['periods', 'games'],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { createPeriod, isCreatingPeriod };
}

export function useDeletePeriod() {
  const queryClient = useQueryClient();
  const { isLoading: isDeletingPeriod, mutate: deletePeriod } = useMutation({
    mutationFn: deletePeriodApi,
    onSuccess: () => {
      toast.success(`Period successfully deleted`);
      queryClient.invalidateQueries({
        queryKey: ['periods', 'games'],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isDeletingPeriod, deletePeriod };
}
