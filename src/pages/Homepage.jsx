import Footer from '../components/Footer';
import Header from '../components/Header';
import { styled } from 'styled-components';

const StyledHomePage = styled.div`
  display: grid;
  overflow: auto;
  height: 100vh;
  grid-template-rows: 15rem 1fr auto;
`;
function Homepage() {
  //TODO create a PageNav page (if we want from the top)
  return (
    <StyledHomePage>
      {/* <Header type="nonApp" /> */}
      <main>
        This is the main section. It will include all things on the landing
        page. This page is before you are logged in
      </main>
      <Footer />
    </StyledHomePage>
  );
}

export default Homepage;
