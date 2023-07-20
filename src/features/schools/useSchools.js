import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSchools } from '../../services/apiSchools';
import { toast } from 'react-hot-toast';

export function useSchools() {
  const {
    isLoading: isLoadingSchools,
    data: schools,
    error,
  } = useQuery({ queryKey: ['schools'], queryFn: getSchools });
  return { isLoadingSchools, error, schools };
}
