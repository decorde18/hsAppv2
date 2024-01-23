import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getGame,
  getGames,
  getGamesSeason,
  createEditGame,
  deleteGame as deleteGameApi,
  cancelGame as cancelGameApi,
  getPeriods,
} from '../../services/apiGames';
import {
  getScheduleHelpers,
  createEditScheduleHelper,
  deleteScheduleHelper as deleteScheduleHelperApi,
} from '../../services/apiScheduleHelper';

import { getGoals } from '../../services/apiStats';
import { toast } from 'react-hot-toast';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import { useSearchParams } from 'react-router-dom';

export function useGame() {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');

  const {
    isLoading: isLoadingGame,
    data: game,
    error,
  } = useQuery({
    queryKey: ['game'],
    queryFn: () => getGame(gameId),
  });

  return { isLoadingGame, error, game };
}
export function useGames() {
  const { currentSeason } = useCurrentSeason();
  //Filter by season

  const filter =
    !currentSeason || currentSeason === 'all'
      ? null
      : { field: 'season', value: currentSeason };

  const {
    isLoading: isLoadingGames,
    data: games,
    error,
  } = useQuery({
    queryKey: ['games', filter],
    queryFn: () => getGames({ filter }),
  });

  return { isLoadingGames, error, games };
}

export function useGamesSeason(seasonId) {
  const {
    isLoading: isLoadingGamesSeason,
    data: gamesSeason,
    error,
  } = useQuery({
    queryKey: ['gamesSeason'],
    queryFn: () => (seasonId ? getGamesSeason(seasonId) : null),
  });
  return { isLoadingGamesSeason, error, gamesSeason };
}

export function useCreateGame() {
  const queryClient = useQueryClient();
  const { mutate: createGame, isLoading: isCreating } = useMutation({
    mutationFn: createEditGame,
    onSuccess: () => {
      toast.success('New Game successfully created');
      queryClient.invalidateQueries({ queries: ['games'] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { createGame, isCreating };
}
export function useEditGame() {
  const queryClient = useQueryClient();
  const { mutate: editGame, isLoading: isEditing } = useMutation({
    mutationFn: ({ newData, id }) => createEditGame(newData, id),
    onSuccess: () => {
      // toast.success('Game successfully edited');
      queryClient.invalidateQueries({ queries: ['games'] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { editGame, isEditing };
}
export function useDeleteGame() {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate: deleteGame } = useMutation({
    mutationFn: deleteGameApi,
    onSuccess: () => {
      toast.success(`Game  successfully deleted`);
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },

    onError: (err) => toast.error(err.message),
  });
  return { isDeleting, deleteGame };
}

export function useGoals() {
  const { currentSeason } = useCurrentSeason();

  //Filter by season

  const filter =
    !currentSeason || currentSeason === 'all'
      ? null
      : { field: 'periodId.game.season', value: currentSeason };

  const {
    isLoading: isLoadingGoals,
    data: goals,
    error,
  } = useQuery({
    queryKey: ['seasonGoals', filter],
    queryFn: () => getGoals({ filter }),
  });

  return { isLoadingGoals, error, goals };
}

export function useGamePeriods(gameId) {
  const {
    isLoading: isLoadingPeriods,
    data: periods,
    error,
  } = useQuery({ queryKey: ['periods'], queryFn: () => getPeriods(gameId) });
  return { isLoadingPeriods, error, periods };
}
export function useCancelGame(gameId) {
  const queryClient = useQueryClient();
  const { isLoading: isCanceling, mutate: cancelGame } = useMutation({
    mutationFn: cancelGameApi,
    onSuccess: () => {
      toast.success(`Game successfully canceled`);
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },

    onError: (err) => toast.error(err.message),
  });
  return { isCanceling, cancelGame };
}

export function useScheduleHelper() {
  const { currentSeason } = useCurrentSeason();
  //Filter by season

  const filter =
    !currentSeason || currentSeason === 'all'
      ? null
      : { field: 'season', value: currentSeason };

  const {
    isLoading: isLoadingScheduleHelpers,
    data: scheduleHelpers,
    error,
  } = useQuery({
    queryKey: ['scheduleHelpers', filter],
    queryFn: () => getScheduleHelpers({ filter }),
  });

  return { isLoadingScheduleHelpers, error, scheduleHelpers };
}
export function useCreateScheduleHelper() {
  const queryClient = useQueryClient();
  const { mutate: createScheduleHelper, isLoading: isCreating } = useMutation({
    mutationFn: createEditScheduleHelper,
    onSuccess: () => {
      toast.success('New Schedule Helper successfully created');
      queryClient.invalidateQueries({ queries: ['scheduleHelper'] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { createScheduleHelper, isCreating };
}
export function useEditScheduleHelper() {
  const queryClient = useQueryClient();
  const { mutate: editScheduleHelper, isLoading: isEditing } = useMutation({
    mutationFn: createEditScheduleHelper,
    onSuccess: () => {
      // toast.success('New Schedule Helper successfully edited');
      queryClient.invalidateQueries({ queries: ['scheduleHelper'] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { editScheduleHelper, isEditing };
}
export function useDeleteScheduleHelper() {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate: deleteScheduleHelper } = useMutation({
    mutationFn: deleteScheduleHelperApi,
    onSuccess: () => {
      // toast.success(`Schedule Helper  successfully deleted`);
      queryClient.invalidateQueries({ queryKey: ['scheduleHelpers'] });
    },

    onError: (err) => toast.error(err.message),
  });
  return { isDeleting, deleteScheduleHelper };
}
