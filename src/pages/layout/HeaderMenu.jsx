import { useSession, useSessionContext } from '@supabase/auth-helpers-react';

import { useNavigate } from 'react-router-dom';
import { googleSignIn } from '../../services/apiAuth';
import Logout from '../../features/authentication/Logout';
import { useUser } from '../../features/authentication/useUser';
import UserAvatar from '../../features/authentication/UserAvatar';

import Button from '../../ui/Button';
import ButtonIcon from '../../ui/ButtonIcon';
import { HiOutlineUser } from 'react-icons/hi2';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 0.5rem;
  width: 100%; /* Fit the grid cell */
`;

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
    <Container>
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
    </Container>
  );
}

export default HeaderMenu;
