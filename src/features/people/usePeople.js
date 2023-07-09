import { useQuery } from '@tanstack/react-query';
import { getPeople } from '../../services/apiPeople';

export function usePeople() {
  const {
    isLoading: isLoadingPeople,
    data: people,
    error,
  } = useQuery({ queryKey: ['people'], queryFn: getPeople });
  return { isLoadingPeople, error, people };
}
