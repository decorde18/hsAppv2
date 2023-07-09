import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createEditPeople } from '../../services/apiPeople';

export function useCreatePeople() {
  const queryClient = useQueryClient();
  const { mutate: createPeople, isLoading: isCreating } = useMutation({
    mutationFn: createEditPeople,
    onSuccess: () => {
      toast.success('New Person successfully created');
      queryClient.invalidateQueries({ queries: ['people'] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { createPeople, isCreating };
}
