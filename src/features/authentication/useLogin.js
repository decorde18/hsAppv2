import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../../services/apiAuth';
import { toast } from 'react-hot-toast';
import supabase from '../../services/supabase';

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user.user);
      navigate('/app', { replace: true });
      if (user.user.app_metadata.provider === 'google') googleSignIn();
    },
    onError: (err) => {
      console.log('Error', err);
      toast.error('The provided email or password are incorrect');
    },
  });
  return { login, isLoading };
}

async function googleSignIn() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    },
  });
  if (error) throw new Error(error.message);
}
