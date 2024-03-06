import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

import SideBar from './SideBar';
import Header from './Header';
import Footer from './Footer';
import MainSection from './MainSection';

import { styled } from 'styled-components';

const StyledAppLayout = styled.div`
  //THIS IS FOR THE HEADER< BODY< FOOTER
  height: 100vh;
  overflow: clip;
  display: grid;
  grid-template-rows: 15rem 1fr auto;
`;
const Main = styled.main`
  height: 100%;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 20rem auto;
  margin: 0 auto;
`;

function AppLayout() {
  // ON LOAD OF PROTECTED ROUTES, UPDATE THE RECENT AND CURRENT IN LOCAL AND CONTEXT PROVIDER
  const { currentSeason } = useCurrentSeason();

  if (!currentSeason) return;

  return (
    <StyledAppLayout>
      <Header />
      <Main className="flex">
        <SideBar />
        <MainSection />
      </Main>
      <Footer />
    </StyledAppLayout>
  );
}

export default AppLayout;
