import { useSession, useSessionContext } from '@supabase/auth-helpers-react';

import { useNavigate } from 'react-router-dom';
import { googleSignIn } from '../../services/apiAuth';
import Logout from '../authentication/Logout';
import { useUser } from '../authentication/useUser';
import UserAvatar from '../authentication/UserAvatar';

import Button from '../../ui/Button';
import ButtonIcon from '../../ui/ButtonIcon';
import { HiOutlineUser } from 'react-icons/hi2';

function HeaderMenu() {
  const { isLoading: isLoadingSupabase } = useSessionContext();
  const { user } = useUser();
  const session = useSession();

  const navigate = useNavigate();
  const isLoading = isLoadingSupabase;
  function handleGoogleSignIn() {
    googleSignIn();
  }
  if (isLoading) return <></>;

  return (
    <div>
      <ButtonIcon onClick={() => navigate('../protected/account')}>
        {user ? <UserAvatar /> : <HiOutlineUser />}
      </ButtonIcon>
      <Logout />
      {session?.provider_token ? (
        <Button size="small">GoogleSignedIn</Button>
      ) : (
        user && (
          <Button size="small" onClick={handleGoogleSignIn}>
            GoogleNotSignedIn
          </Button>
        )
      )}
    </div>
  );
}

export default HeaderMenu;
