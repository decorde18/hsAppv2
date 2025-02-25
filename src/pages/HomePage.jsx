import { styled } from 'styled-components';
import Header from './layout/Header';
import Footer from './layout/Footer';
import { NavLink } from 'react-router-dom';
import Row from '../ui/Row';
import Button from '../ui/Button';

const StyledHomePage = styled.div`
  display: grid;
  overflow: auto;
  height: 100dvh;
  grid-template-rows: 15rem 1fr auto;
`;
const Main = styled.main`
  margin: 10rem auto;
`;
const StyledNav = styled.span`
  color: blue;
  text-decoration: underline;
`;
function HomePage() {
  return (
    <StyledHomePage>
      <Header type="nonApp" />

      <Row type="horizontal" justify="center">
        <NavLink to="/public/schedule">
          <Button size="medium" variation="primary">
            SCHEDULE
          </Button>
        </NavLink>
      </Row>
      <Main>
        <h1>
          <span>New Players, please </span>
          <StyledNav>
            <NavLink to="/public/newplayer">SIGN UP</NavLink>
          </StyledNav>
          <span> to get on our email list</span>
        </h1>
      </Main>
      <Footer />
    </StyledHomePage>
  );
}

export default HomePage;
