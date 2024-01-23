import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  getMinorEvent,
  getMinorEvents,
  createEditMinorEvent,
  deleteMinorEventApi,
} from '../../../services/apiMinorEvents';
import { useSearchParams } from 'react-router-dom';

export function useMinorEvents() {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');

  const {
    isLoading: isLoadingMinorEvents,
    data: minorEvents,
    error,
  } = useQuery({
    queryKey: ['minorEvents', 'periods', 'games'],
    queryFn: () => getMinorEvent(gameId),
  });
  return { isLoadingMinorEvents, minorEvents };
}

export function useUpdateMinorEvent() {
  const queryClient = useQueryClient();
  const { mutate: updateMinorEvents, isLoading: isUpdatingMinorEvent } =
    useMutation({
      mutationFn: createEditMinorEvent,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queries: ['minorEvents', 'periods', 'games'],
        });
      },
      onError: (err) => toast.error(err.message),
    });
  return { isUpdatingMinorEvent, updateMinorEvents };
}

export function useCreateMinorEvent() {
  const queryClient = useQueryClient();
  const { mutate: createMinorEvent, isLoading: isCreatingMinorEvent } =
    useMutation({
      mutationFn: createEditMinorEvent,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queries: ['minorEvents', 'periods', 'games'],
        });
      },
      onError: (err) => toast.error(err.message),
    });

  return { createMinorEvent, isCreatingMinorEvent };
}

export function useDeleteMinorEvent() {
  const queryClient = useQueryClient();
  const { isLoading: isDeletingMinorEvent, mutate: deleteMinorEvent } =
    useMutation({
      mutationFn: deleteMinorEventApi,
      onSuccess: () => {
        toast.success(`Minor Event successfully deleted`);
        queryClient.invalidateQueries({
          queryKey: ['minorEvents', 'periods', 'games'],
        });
      },
      onError: (err) => toast.error(err.message),
    });
  return { isDeletingMinorEvent, deleteMinorEvent };
}
