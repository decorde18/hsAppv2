import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  getPlayerSeason,
  getPlayerSeasons,
  updatePlayerSeason,
  createPlayerSeasons,
  deletePlayerSeasonApi,
  getPlayerSeasonWithNumbers,
} from '../../services/apiPlayers';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

//TODO change all PlayerSeasons to add the object
export function usePlayerSeasons(season) {
  //Filter by season
  const { currentSeason, recentSeason } = useCurrentSeason();
  const filter =
    season === 'recent'
      ? { field: 'seasonId', value: recentSeason }
      : !currentSeason || currentSeason === 'all'
      ? null
      : { field: 'seasonId', value: currentSeason };

  const {
    isLoading: isLoadingPlayerSeasons,
    data: playerSeasons,
    error,
  } = useQuery({
    queryKey: ['playerSeasons', filter],
    queryFn: () => getPlayerSeasons({ filter }),
  });
  return { isLoadingPlayerSeasons, error, playerSeasons };
}
//TODO Take this out and just use usePlayerSeasons with the filter, maybe use this for specific player, specific season
export function usePlayerSeason(seasonId) {
  const {
    isLoading: isLoadingPlayerSeason,
    data: playerSeason,
    error,
  } = useQuery({
    queryKey: ['playerSeason'],
    queryFn: () => getPlayerSeason(seasonId),
  });
  return { isLoadingPlayerSeason, error, playerSeason };
}

export function useUpdatePlayerSeason() {
  const queryClient = useQueryClient();
  const { mutate: updateSetting, isLoading: isUpdating } = useMutation({
    mutationFn: updatePlayerSeason,
    onSuccess: () => {
      // toast.success('Successfully edited');
      queryClient.invalidateQueries({ queries: ['settings'] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isUpdating, updateSetting };
}

export function useCreatePlayerSeason() {
  const queryClient = useQueryClient();
  const { mutate: createPlayerSeason, isLoading: isCreatingPlayerSeason } =
    useMutation({
      mutationFn: createPlayerSeasons,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queries: ['playerSeasons', 'players'],
        });
      },
      onError: (err) => toast.error(err.message),
    });

  return { createPlayerSeason, isCreatingPlayerSeason };
}

export function useDeletePlayerSeason() {
  const queryClient = useQueryClient(); //from App
  const { isLoading: isDeleting, mutate: deletePlayerSeason } = useMutation({
    mutationFn: deletePlayerSeasonApi, //Same
    onSuccess: () => {
      toast.success(`PlayerSeason  successfully deleted`);
      queryClient.invalidateQueries({
        queryKey: ['players', 'seasons', 'playerSeasons'],
      }); // this
    },

    onError: (err) => toast.error(err.message),
  });
  return { isDeleting, deletePlayerSeason };
}

export function usePlayerSeasonWithNumber(seasonId) {
  const {
    isLoading: isLoadingPlayerSeasonWithNumber,
    data: playerSeasonWithNumber,
    error,
  } = useQuery({
    queryKey: ['playerSeasonWithNumber'],
    queryFn: () => getPlayerSeasonWithNumbers(seasonId),
  });
  return { isLoadingPlayerSeasonWithNumber, error, playerSeasonWithNumber };
}
