import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getLocations } from '../../services/apiLocations';
import { toast } from 'react-hot-toast';

export function useLocations() {
  const {
    isLoading: isLoadingLocations,
    data: locations,
    error,
  } = useQuery({ queryKey: ['locations'], queryFn: getLocations });
  return { isLoadingLocations, error, locations };
}
