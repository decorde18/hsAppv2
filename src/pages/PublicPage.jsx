import { styled } from 'styled-components';
import Header from '../features/layout/Header';
import Footer from '../features/layout/Footer';
import { NavLink } from 'react-router-dom';

const StyledPublicPage = styled.div`
  display: grid;
  overflow: auto;
  height: 100vh;
  grid-template-rows: 15rem 1fr auto;
`;
const Main = styled.main`
  margin: auto;
`;
const StyledNav = styled.span`
  color: blue;
  text-decoration: underline;
`;
function PublicPage() {
  return (
    <StyledPublicPage>
      <Header type="nonApp" />
      <Main>
        <h1>
          <span>New Players, please </span>
          <StyledNav>
            <NavLink to="../newplayer">SIGN UP</NavLink>
          </StyledNav>
          <span> to get on our email list</span>
        </h1>
      </Main>
      <Footer />
    </StyledPublicPage>
  );
}

export default PublicPage;
