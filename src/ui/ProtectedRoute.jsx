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

import { useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useUser();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      const redirectPath = `/public/login?redirect=${location.pathname}`;
      navigate(redirectPath); // Redirect to login with a "redirect" query parameter
    }
  }, [isLoading, navigate, isAuthenticated, location]);

  if (isLoading)
    return (
      <FullPage>
        <SpinnerStyle>
          <Spinner />
        </SpinnerStyle>
      </FullPage>
    );

  if (isAuthenticated) return <>{children}</>;
}

export default ProtectedRoute;
