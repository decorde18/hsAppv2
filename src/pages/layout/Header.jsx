import { styled } from 'styled-components';

import HeaderMenu from './HeaderMenu';
import AppNav from './AppNav';

import Logo from '../../ui/Logo';
import Heading from '../../ui/Heading';

const StyledHeader = styled.header`
  /* background-color: blue; */
  flex: 0;
  padding: 0.5rem;
  display: grid;
  grid-template-columns: 18rem 1fr 18rem;
  text-align: center;
`;

const LogoDiv = styled.div`
  /* background-color: red; */
  grid-column: 1/2;
  grid-row: 1/-1;
`;
const MainDiv = styled.div`
  /* background-color: green; */
  grid-column: 2/-2;
  grid-row: 1/-1;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  justify-content: center;
`;
const AccountDiv = styled.div`
  /* background-color: yellow; */

  display: flex;
  flex-direction: column;
  justify-content: center;
  grid-column: 3/-1;
  grid-row: 1/-1;
`;
function Header({ type }) {
  return (
    <StyledHeader className="relative mb-2">
      <LogoDiv>
        <Logo />
      </LogoDiv>
      <MainDiv>
        <Heading as="h4" case="upper" location="center">
          INDEPENDENCE GIRLS SOCCER
        </Heading>
        {type !== 'nonApp' && <AppNav />}
      </MainDiv>
      <AccountDiv>
        <HeaderMenu />
      </AccountDiv>
    </StyledHeader>
  );
}

export default Header;
