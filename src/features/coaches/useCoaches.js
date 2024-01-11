import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCoaches,
  createEditCoach,
  deleteCoachApi,
} from '../../services/apiCoaches';
import { toast } from 'react-hot-toast';

export function useCoaches() {
  const {
    //destructure has plenty of other useful values ie status console.log this query to see the different ones
    isLoading: isLoadingCoaches,
    data: coaches,
    error,
  } = useQuery({ queryKey: ['coaches'], queryFn: getCoaches });

  return { isLoadingCoaches, coaches };
}

export function useCreateCoach() {
  const queryClient = useQueryClient();
  const { mutate: createCoach, isLoading: isCreating } = useMutation({
    mutationFn: createEditCoach,
    onSuccess: () => {
      // toast.success('New Coach successfully created');
      queryClient.invalidateQueries({ queries: ['coaches'] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { createCoach, isCreating };
}
export function useEditCoach() {
  const queryClient = useQueryClient();
  const { mutate: editCoach, isLoading: isEditing } = useMutation({
    mutationFn: ({ newCoachData, id }) => createEditCoach(newCoachData, id),
    onSuccess: () => {
      toast.success('New Coach successfully edited');
      queryClient.invalidateQueries({ queries: ['coaches'] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { editCoach, isEditing };
}
export function useDeleteCoach() {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate: deleteCoach } = useMutation({
    mutationFn: deleteCoachApi,
    onSuccess: () => {
      toast.success(`Coach  successfully deleted`);
      queryClient.invalidateQueries({ queryKey: ['coaches'] });
    },

    onError: (err) => toast.error(err.message),
  });
  return { isDeleting, deleteCoach };
}
