import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getRecentSeason,
  getSeasons,
  getSeason,
  // getSeason as curSeasonApi,
  updateSeasonApi,
  createEditSeason,
} from '../../services/apiSeasons';
import { toast } from 'react-hot-toast';
import { useSearchParams, useParams } from 'react-router-dom';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

export function useSeasons() {
  /*filter pagination*/
  // const { currentSeason } = useCurrentSeason();
  // console.log(currentSeason);
  //FILTER
  // const [searchParams, setSearchParams] = useSearchParams();
  // searchParams.set('season', currentSeason);
  // setSearchParams(searchParams);
  // const filterValue = searchParams.get('season');
  // const filter =
  //   !filterValue || filterValue === 'all'
  //     ? null
  //     : { field: 'season', value: filterValue, method: 'eq' };
  const {
    //destructure has plenty of other useful values ie status console.log this query to see the different ones
    isLoading: isLoadingSeasons,
    data: seasons,
    error,
  } = useQuery({
    queryKey: ['seasons'] /*filter pagination*/,
    queryFn: () => getSeasons() /*filter pagination*/,
  });

  return { isLoadingSeasons, error, seasons };
}
export function useSeason() {
  const { currentSeason } = useCurrentSeason();
  // const [searchParams, setSearchParams] = useSearchParams();
  // searchParams.set('season', currentSeason);
  // setSearchParams(searchParams);
  //Filter by season
  const filter = { field: 'seasonId', value: currentSeason };
  const { isLoading: isLoadingSeason, data: season } = useQuery({
    queryKey: ['season', filter],
    queryFn: () => getSeason(currentSeason),
    retry: false,
  });
  return { isLoadingSeason, season };
}
export function useRecentSeason() {
  const {
    isLoading: isLoadingRecent,
    data,
    error,
  } = useQuery({ queryKey: ['recentSeason'], queryFn: getRecentSeason });
  const [recentSeason] = data ? data : [];
  return { isLoadingRecent, error, recentSeason };
}

export function useUpdateSeason(seasonId, updateField) {
  const queryClient = useQueryClient();

  const { mutate: updateSeason, isLoading: isUpdating } = useMutation({
    mutationFn: updateSeasonApi,
    onSuccess: () => {
      toast.success('Successfully edited');
      queryClient.invalidateQueries({ queries: ['season'] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isUpdating, updateSeason };
}
export function useCreateSeason() {
  const queryClient = useQueryClient();
  const { mutate: createSeason, isLoading: isCreating } = useMutation({
    mutationFn: createEditSeason,
    onSuccess: () => {
      toast.success('New Season successfully created');
      queryClient.invalidateQueries({ queries: ['seasons'] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { createSeason, isCreating };
}
