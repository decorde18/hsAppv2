import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createEditPeople } from '../../services/apiPeople';

export function useEditPeople() {
  const queryClient = useQueryClient();
  const { mutate: editPeople, isLoading: isEditing } = useMutation({
    mutationFn: ({ newPeopleData, id }) => createEditPeople(newPeopleData, id),
    onSuccess: () => {
      toast.success('New Person successfully edited');
      queryClient.invalidateQueries({ queries: ['people'] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isEditing, editPeople };
}
