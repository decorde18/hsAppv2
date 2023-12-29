import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  login as loginApi,
  googleSignIn as googleSignInApi,
} from '../../services/apiAuth';
import { toast } from 'react-hot-toast';

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user.user);
      navigate('/app', { replace: true });
      // if (user.user.app_metadata.provider === 'google') googleSignIn();
    },
    onError: (err) => {
      console.log('Error', err);
      toast.error('The provided email or password are incorrect');
    },
  });
  return { login, isLoading };
}

export function useGoogleSignIn() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: googleSignIn, isLoading } = useMutation({
    mutationFn: () => googleSignInApi(),
    onSuccess: (user) => {
      queryClient.setQueryData(['googleUser'], user.user);
      navigate('/app', { replace: true });
    },
    onError: (err) => {
      console.log('Error', err);
      toast.error('Google Login Failed');
    },
  });
  return { googleSignIn, isLoading };
}
