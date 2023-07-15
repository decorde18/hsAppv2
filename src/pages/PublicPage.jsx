import { styled } from 'styled-components';
import Header from '../ui/Header';
import Footer from '../components/Footer';

const StyledPublicPage = styled.div`
  display: grid;
  overflow: auto;
  height: 100vh;
  grid-template-rows: 15rem 1fr auto;
`;
//TODO create a PageNav page (if we want from the top)

function PublicPage() {
  return (
    <StyledPublicPage>
      <Header type="nonApp" />
      <main>
        This is the main section. It will include all things on the landing
        page. This page is before you are logged in
      </main>
      <Footer />
    </StyledPublicPage>
  );
}

export default PublicPage;
