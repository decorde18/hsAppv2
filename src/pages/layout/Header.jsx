import { styled } from 'styled-components';

import HeaderMenu from './HeaderMenu';
import AppNav from './AppNav';

import Logo from '../../ui/Logo';
import Heading from '../../ui/Heading';

const StyledHeader = styled.header`
  grid-column: 1 / 3; /* Span across both columns */
  grid-row: 1; /* Occupy the first row */
  display: grid;
  grid-template-columns: 18rem 1fr 18rem; /* Sidebar (left), Main Content (center), Sidebar (right) */
  align-items: center;
  justify-items: center;
  padding: 1rem;

  width: 100%;
  max-width: 100%; /* Ensure the header does not exceed the page width */
  box-sizing: border-box; /* Include padding in the width calculation */
  overflow: hidden; /* Prevent content from spilling outside */
`;
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const CenterSection = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

function Header({ type }) {
  return (
    <StyledHeader>
      <LeftSection>
        <Logo />
      </LeftSection>
      <CenterSection>
        <Heading as="h4" case="upper" location="center">
          INDEPENDENCE GIRLS SOCCER
        </Heading>
        {type !== 'nonApp' && <AppNav />}
      </CenterSection>
      <HeaderMenu />
    </StyledHeader>
  );
}

export default Header;
