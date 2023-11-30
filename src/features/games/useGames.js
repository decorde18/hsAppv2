import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getGames,
  getGamesSeason,
  createEditGame,
  deleteGame as deleteGameApi,
  cancelGame as cancelGameApi,
  getPeriods,
} from '../../services/apiGames';
import { getGoals } from '../../services/apiStats';
import { toast } from 'react-hot-toast';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

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
    mutationFn: ({ newGameData, id }) => createEditGame(newGameData, id),
    onSuccess: () => {
      toast.success('New Game successfully edited');
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
      : { field: 'periodId.gameId.season', value: currentSeason };

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
