import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDataApi,
  getData,
  updateDataApi,
  deleteDataApi,
} from './apiUniversal';
import toast from 'react-hot-toast';
import { useCurrentSeason } from '../contexts/CurrentSeasonContext';

const tables = [
  { name: 'people' },
  {
    name: 'seasons',
  },
  { view: 'season_stats_view' },
  { view: 'seasons_view' },
  {
    name: 'players',
    view: 'players_view',
  },
  {
    name: 'playerSeasons',
    view: 'players_seasons_view',
  },
  { name: 'parents', view: 'parents_view' },
  {
    name: 'playerParents',
    view: 'player_parents_view',
  },
  {
    name: 'games',
    view: 'games_view',
  },
  {
    name: 'locations',
    view: 'locations_view',
  },
  {
    name: 'schools',
    view: 'schools_view',
  },
];

export function useCreateData() {
  const queryClient = useQueryClient();
  const { mutate: createData, isLoading: isCreating } = useMutation({
    mutationFn: createDataApi,
    onSuccess: ({ data, table, view }) => {
      toast.success(`New Data successfully created in ${table}`);
      queryClient.invalidateQueries({ queries: [view] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createData };
}
export function useData({ table, filter, sort, isSeason }) {
  // const { currentSeason } = useCurrentSeason();

  table =
    tables.find((tab) => tab.name === table)?.view ||
    tables.find((tab) => tab.name === table).name;
  // filter = isSeason
  //   ? [...filter, { field: 'seasonId', value: currentSeason }]
  //   : filter;
  const { isLoading, data, error } = useQuery({
    queryKey: [table, filter, sort],
    queryFn: () => getData({ table, filter, sort }),
  });

  return { isLoading, error, data };
}
export function useUpdateData() {
  const queryClient = useQueryClient();
  const { mutate: updateData, isLoading: isUpdating } = useMutation({
    mutationFn: updateDataApi,
    onSuccess: ({ view }) => {
      queryClient.invalidateQueries({ queries: [view] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isUpdating, updateData };
}
export function useDeleteData() {
  const queryClient = useQueryClient(); //from App
  const { isLoading: isDeleting, mutate: deleteData } = useMutation({
    mutationFn: deleteDataApi,
    onSuccess: ({ table, view }) => {
      toast.success(`${table}  successfully deleted`);
      queryClient.invalidateQueries({ queryKey: [view] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isDeleting, deleteData };
}

// ALL AVAILABLE VALUES FROM DESTRUCTURE OF USEQUERY
// {
//     "status": "loading",
//     "fetchStatus": "fetching",
//     "isLoading": true,
//     "isSuccess": false,
//     "isError": false,
//     "isInitialLoading": true,
//     "dataUpdatedAt": 0,
//     "error": null,
//     "errorUpdatedAt": 0,
//     "failureCount": 0,
//     "failureReason": null,
//     "errorUpdateCount": 0,
//     "isFetched": false,
//     "isFetchedAfterMount": false,
//     "isFetching": true,
//     "isRefetching": false,
//     "isLoadingError": false,
//     "isPaused": false,
//     "isPlaceholderData": false,
//     "isPreviousData": false,
//     "isRefetchError": false,
//     "isStale": true
// }
