import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getSchools,
  createEditSchool,
  deleteSchool,
} from '../../services/apiSchools';
import { toast } from 'react-hot-toast';

export function useSchools() {
  const {
    isLoading: isLoadingSchools,
    data: schools,
    error,
  } = useQuery({ queryKey: ['schools'], queryFn: getSchools });
  return { isLoadingSchools, error, schools };
}

export function useCreateSchool() {
  const queryClient = useQueryClient();
  const { mutate: createSchool, isLoading: isCreating } = useMutation({
    mutationFn: createEditSchool,
    onSuccess: () => {
      // toast.success('New School successfully created');
      queryClient.invalidateQueries({ queries: ['schools'] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { createSchool, isCreating };
}

export function useEditSchool() {
  const queryClient = useQueryClient();
  const { mutate: editSchool, isLoading: isEditing } = useMutation({
    mutationFn: ({ newSchoolData, id }) => createEditSchool(newSchoolData, id),
    onSuccess: () => {
      toast.success('New School successfully edited');
      queryClient.invalidateQueries({ queries: ['schools'] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { editSchool, isEditing };
}
export function useDeleteSchool() {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate: deleteSchool } = useMutation({
    mutationFn: deleteSchool,
    onSuccess: () => {
      toast.success(`School successfully deleted`);
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },

    onError: (err) => toast.error(err.message),
  });
  return { isDeleting, deleteSchool };
}
