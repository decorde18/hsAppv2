import { styled } from 'styled-components';
import { useSession, useSessionContext } from '@supabase/auth-helpers-react';

import { useNavigate } from 'react-router-dom';
import { useGoogleSignIn } from '../authentication/useLogin';
import Logout from '../authentication/Logout';
import { useUser } from '../authentication/useUser';
import UserAvatar from '../authentication/UserAvatar';

import Row from '../../ui/Row';
import Button from '../../ui/Button';
import ButtonIcon from '../../ui/ButtonIcon';
import { HiOutlineUser } from 'react-icons/hi2';

function HeaderMenu() {
  const { isLoading: isLoadingSupabase } = useSessionContext();
  const { user } = useUser();
  const session = useSession();
  const { googleSignIn, isLoading: isLoadingGoogle } = useGoogleSignIn();

  const navigate = useNavigate();
  const isLoading = isLoadingGoogle || isLoadingSupabase;
  function handleGoogleSignIn() {
    googleSignIn();
  }
  if (isLoading) return <></>;

  return (
    <Row type="horizontal">
      <Row type="vertical">
        <ButtonIcon onClick={() => navigate('../protected/account')}>
          {user ? <UserAvatar /> : <HiOutlineUser />}
        </ButtonIcon>
      </Row>
      {session?.provider_token ? (
        <Button size="small">GoogleSignedIn</Button>
      ) : (
        user && (
          <Button size="small" onClick={handleGoogleSignIn}>
            GoogleNotSignedIn
          </Button>
        )
      )}
      <Logout />
    </Row>
  );
}

export default HeaderMenu;
