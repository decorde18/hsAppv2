import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

import SideBar from './SideBar';
import Header from './Header';
import Footer from './Footer';
import MainSection from './MainSection';

import { styled } from 'styled-components';
import { useEffect } from 'react';
import { useRecentSeason } from '../seasons/useSeasons';

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
  const { currentSeason, updateCurrentSeason, updateRecentSeason } =
    useCurrentSeason();
  const { isLoadingRecent, recentSeason } = useRecentSeason();

  useEffect(
    function () {
      if (isLoadingRecent) return;
      updateRecentSeason(recentSeason.id);
      if (!currentSeason) updateCurrentSeason(recentSeason.id);
    },
    [
      currentSeason,
      updateCurrentSeason,
      recentSeason,
      updateRecentSeason,
      isLoadingRecent,
    ]
  );

  if (isLoadingRecent) return;

  return (
    <StyledAppLayout>
      <Header />
      <Main className="flex">
        <SideBar> </SideBar>
        <MainSection></MainSection>
      </Main>
      <Footer />
    </StyledAppLayout>
  );
}

export default AppLayout;
