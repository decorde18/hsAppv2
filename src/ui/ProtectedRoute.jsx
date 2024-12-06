import { useNavigate } from 'react-router-dom';
import { useUser } from '../features/authentication/useUser';
import Spinner from './Spinner';
import { styled } from 'styled-components';
import { useEffect } from 'react';

const FullPage = styled.div`
  display: flex;
  height: 100vh; /* Full viewport height */
  overflow: hidden;
`;
const SpinnerStyle = styled.div`
  flex: 1;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  // load authenticated user
  const { isLoading, isAuthenticated } = useUser();
  //if no auth user, redirect to login
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) navigate('/login');
    },
    [isLoading, navigate, isAuthenticated]
  );
  //while loading show spinner
  if (isLoading)
    return (
      <FullPage>
        <SpinnerStyle>
          <Spinner />
        </SpinnerStyle>
      </FullPage>
    );
  // if there is, render the app
  if (isAuthenticated) return <>{children}</>;
}

export default ProtectedRoute;
