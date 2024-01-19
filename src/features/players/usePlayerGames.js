import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  getPlayerGame,
  getPlayerGames,
  createEditPlayerGame,
  deletePlayerGameApi,
} from '../../services/apiPlayerGames';
import { useSearchParams } from 'react-router-dom';

export function usePlayerGames() {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');

  const {
    isLoading: isLoadingPlayerGames,
    data: playerGames,
    error,
  } = useQuery({
    queryKey: ['playerGames', 'players', 'games'],
    queryFn: () => getPlayerGame(gameId),
  });
  return { isLoadingPlayerGames, playerGames };
}

export function useUpdatePlayerGame() {
  const queryClient = useQueryClient();
  const { mutate: updatePlayerGames, isLoading: isUpdating } = useMutation({
    mutationFn: createEditPlayerGame,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queries: ['playerGames', 'players', 'games'],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isUpdating, updatePlayerGames };
}

export function useCreatePlayerGame() {
  const queryClient = useQueryClient();
  const { mutate: createPlayerGame, isLoading: isCreatingPlayerGame } =
    useMutation({
      mutationFn: createEditPlayerGame,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queries: ['playerGames', 'players', 'games'],
        });
      },
      onError: (err) => toast.error(err.message),
    });

  return { createPlayerGame, isCreatingPlayerGame };
}

export function useDeleteGamePlayer() {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate: deletePlayerGame } = useMutation({
    mutationFn: deletePlayerGameApi,
    onSuccess: () => {
      toast.success(`Player Game successfully deleted`);
      queryClient.invalidateQueries({
        queryKey: ['playerGames', 'players', 'games'],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isDeleting, deletePlayerGame };
}
