import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  getStoppage,
  getStoppages,
  createEditStoppage,
  deleteStoppageApi,
} from '../../../services/apiStoppages';
import { useSearchParams } from 'react-router-dom';

export function useStoppages() {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');

  const {
    isLoading: isLoadingStoppages,
    data: stoppages,
    error,
  } = useQuery({
    queryKey: ['stoppages', 'periods', 'games'],
    queryFn: () => getStoppage(gameId),
  });
  return { isLoadingStoppages, stoppages };
}

export function useUpdateStoppage() {
  const queryClient = useQueryClient();
  const { mutate: updateStoppages, isLoading: isUpdatingStoppage } =
    useMutation({
      mutationFn: createEditStoppage,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queries: ['stoppages', 'periods', 'games'],
        });
      },
      onError: (err) => toast.error(err.message),
    });
  return { isUpdatingStoppage, updateStoppages };
}

export function useCreateStoppage() {
  const queryClient = useQueryClient();
  const { mutate: createStoppage, isLoading: isCreatingStoppage } = useMutation(
    {
      mutationFn: createEditStoppage,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queries: ['stoppages', 'periods', 'games'],
        });
      },
      onError: (err) => toast.error(err.message),
    }
  );

  return { createStoppage, isCreatingStoppage };
}

export function useDeleteStoppage() {
  const queryClient = useQueryClient();
  const { isLoading: isDeletingStoppage, mutate: deleteStoppage } = useMutation(
    {
      mutationFn: deleteStoppageApi,
      onSuccess: () => {
        toast.success(`Stoppage successfully deleted`);
        queryClient.invalidateQueries({
          queryKey: ['stoppages', 'periods', 'games'],
        });
      },
      onError: (err) => toast.error(err.message),
    }
  );
  return { isDeletingStoppage, deleteStoppage };
}
