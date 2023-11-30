import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getCalendar } from '../../services/apiGoogle';
import { toast } from 'react-hot-toast';
import { useSearchParams, useParams } from 'react-router-dom';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

export function useCalendar() {
  const { currentSeason } = useCurrentSeason();
  /*filter pagination*/
  //FILTER
  const filterValue = currentSeason;
  const filter =
    !filterValue || filterValue === 'all'
      ? null
      : { field: 'season', value: filterValue, method: 'eq' };

  const {
    isLoading: isLoadingCalendar,
    data: calendar,
    error,
  } = useQuery({
    queryKey: ['calendar'],
    queryFn: () => getCalendar({ filter }),
  });
  console.log(calendar);
  return { isLoadingCalendar, error, calendar };
}
