import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getGames,
  getGamesSeason,
  createEditGame,
  deleteGame as deleteGameApi,
} from '../../services/apiGames';
import { toast } from 'react-hot-toast';

export function useGames() {
  const {
    isLoading: isLoadingGames,
    data: games,
    error,
  } = useQuery({ queryKey: ['games'], queryFn: getGames });

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
