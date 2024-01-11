import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getEvents,
  createEditEvent,
  deleteEvent as deleteEventApi,
} from '../../services/apiEvents';

import { toast } from 'react-hot-toast';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

export function useEvents() {
  const { currentSeason } = useCurrentSeason();
  //Filter by season

  const filter =
    !currentSeason || currentSeason === 'all'
      ? null
      : { field: 'season', value: currentSeason };

  const {
    isLoading: isLoadingEvents,
    data: events,
    error,
  } = useQuery({
    queryKey: ['events', filter],
    queryFn: () => getEvents({ filter }),
  });

  return { isLoadingEvents, error, events };
}
export function useCreateEvent() {
  const queryClient = useQueryClient();
  const { mutate: createEvent, isLoading: isCreating } = useMutation({
    mutationFn: createEditEvent,
    onSuccess: () => {
      toast.success('New Event successfully created');
      queryClient.invalidateQueries({ queries: ['events'] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { createEvent, isCreating };
}
export function useEditEvent() {
  const queryClient = useQueryClient();
  const { mutate: editEvent, isLoading: isEditing } = useMutation({
    mutationFn: ({ newEventData, id }) => createEditEvent(newEventData, id),
    onSuccess: () => {
      toast.success('New Event successfully edited');
      queryClient.invalidateQueries({ queries: ['events'] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { editEvent, isEditing };
}
export function useDeleteEvent() {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate: deleteEvent } = useMutation({
    mutationFn: deleteEventApi,
    onSuccess: () => {
      toast.success(`Event  successfully deleted`);
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },

    onError: (err) => toast.error(err.message),
  });
  return { isDeleting, deleteEvent };
}
