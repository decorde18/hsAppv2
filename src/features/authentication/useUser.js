import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, updateCurrentUser } from '../../services/apiAuth';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export function useUser() {
  const {
    isLoading,
    data: user,
    error,
  } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    onError: (err) => toast.error(err.message),
  });
  return { isLoading, user, isAuthenticated: user?.role === 'authenticated' };
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: ({ user }) => {
      toast.success('User account successfully updated');
      queryClient.invalidateQueries({ queries: ['user'] });
      queryClient.setQueryData(['user'], user);
    },
    onError: (err) => toast.error(err.message),
  });
  return { isUpdating, updateUser };
}
