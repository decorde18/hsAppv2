import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { deletePeople as deletePeopleApi } from '../../services/apiPeople';

export function useDeletePeople() {
  const queryClient = useQueryClient(); //from App
  const { isLoading: isDeleting, mutate: deletePeople } = useMutation({
    //again you get the isLoading value as well as the mutate callback function
    // mutationFn: (id) => deletePeople(id),
    mutationFn: deletePeopleApi, //Same
    onSuccess: () => {
      // alert(`People ${name} successfully deleted`);
      toast.success(`Person  successfully deleted`);
      queryClient.invalidateQueries({ queryKey: ['people'] }); // this invalidates data thus making it fetch so the UI is updated with the server -- can specify which queries to invalidate
    },
    // onError: (err) => alert(err.message), //comes from apiPeople
    onError: (err) => toast.error(err.message),
  });
  return { isDeleting, deletePeople };
}
