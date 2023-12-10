import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createCalendarEventApi, getCalendar } from '../../services/apiGoogle';
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

  return { isLoadingCalendar, error, calendar };
}

export function useCreateCalendarEvent() {
  const queryClient = useQueryClient();
  const {
    data: dataForCalEvent,
    mutate: createCalendarEvent,
    isLoading: isCreatingCalEvent,
  } = useMutation({
    mutationFn: createCalendarEventApi,
    onSuccess: (data) => {
      toast.success('New Calendar Event successfully created');
      queryClient.invalidateQueries({ queries: ['calendarEvent'] }); // TODO this needs to be removed or updated to games, but could also be events. Not sure...if I only use this app for games, then easy, but if I add all calendar events through it, that is when I am not sure how I am doing it
      return data;
    },
    onError: (err) => toast.error(err.message),
  });

  return { createCalendarEvent, isCreatingCalEvent, dataForCalEvent };
}
