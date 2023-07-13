// import { createContext } from 'react';
// import User from '../components/User';
import Logo from './Logo';
import SeasonSelector from './SeasonSelector';
// import { useAuth } from '../contexts/FakeAuthContexts';
import { styled } from 'styled-components';

const StyledHeader = styled.header`
  display: relative;
  margin-bottom: 0.5rem;
  text-align: center;
`;
const Div = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const Div2 = styled.div`
  margin-top: auto;
  margin-bottom: 1.25rem;
`;
const H1 = styled.h1`
  margin-top: 2.5rem;
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 700;
  color: var(--color-brand--2);
`;

function Header({ seasonProps, type }) {
  // const { isAuthenticated } = useAuth();
  return (
    <StyledHeader className="relative mb-2">
      <Logo></Logo>
      <Div>
        <H1>INDEPENDENCE GIRLS SOCCER</H1>
        {type !== 'nonApp' && (
          <Div2>
            <SeasonSelector seasonProps={seasonProps} />
          </Div2>
        )}
      </Div>
      {/* {isAuthenticated ? <User /> : null} */}
    </StyledHeader>
  );
}

export default Header;
