import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { deletePlayer as deletePlayerApi } from '../../services/apiPlayers';

export function useDeletePlayer() {
  const queryClient = useQueryClient(); //from App
  const { isLoading: isDeleting, mutate: deletePlayer } = useMutation({
    //again you get the isLoading value as well as the mutate callback function
    // mutationFn: (id) => deletePlayer(id),
    mutationFn: deletePlayerApi, //Same
    onSuccess: () => {
      // alert(`Player ${name} successfully deleted`);
      toast.success(`Player  successfully deleted`);
      queryClient.invalidateQueries({ queryKey: ['cabins'] }); // this invalidates data thus making it fetch so the UI is updated with the server -- can specify which queries to invalidate
    },
    // onError: (err) => alert(err.message), //comes from apiPlayers
    onError: (err) => toast.error(err.message),
  });
  return { isDeleting, deletePlayer };
}
