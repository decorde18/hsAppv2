// import { createContext } from 'react';
// import User from '../components/User';
import Logo from '../../ui/Logo';
import HeaderMenu from './HeaderMenu';
import SeasonSelector from './SeasonSelector';
// import { useAuth } from '../contexts/FakeAuthContexts';
import { styled } from 'styled-components';
import Logout from '../authentication/Logout';
import Button from '../../ui/Button';
import { NavLink } from 'react-router-dom';
import Row from '../../ui/Row';

const StyledHeader = styled.header`
  display: flex;
  margin-bottom: 0.5rem;
  text-align: center;
  justify-content: space-between;
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

function Header({ type }) {
  return (
    <StyledHeader className="relative mb-2">
      <Logo />
      <Div>
        <H1>INDEPENDENCE GIRLS SOCCER</H1>
        <Row type="horizontal" justify="center">
          <NavLink to="../schedule">
            <Button size="medium" variation="primary">
              SCHEDULE
            </Button>
          </NavLink>
        </Row>
        {type !== 'nonApp' && (
          <Div2>
            <SeasonSelector />
          </Div2>
        )}
      </Div>
      <HeaderMenu />
    </StyledHeader>
  );
}

export default Header;
