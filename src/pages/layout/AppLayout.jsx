import { styled } from 'styled-components';

import SideBar from './StatsSideBar';
import Header from './Header';
import Footer from './Footer';

import { Outlet } from 'react-router-dom';
import { AppNavContextProvider } from '../../contexts/AppNavContext';

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-rows: 16rem 1fr 5rem; /* Header auto-height, content fills remaining space */
  height: 100vh; /* Full viewport height */
  grid-template-columns: 15fr 85fr; //aside main
  overflow: hidden;
  width: 100%;
`;

const Aside = styled.aside`
  /* background-color: blue; */
  grid-row: 2 / 4;
  position: sticky;
  margin: 0 auto;
  top: 15rem;
  padding: 1rem;
  height: 100%;
  overflow-y: auto;
`;

const Main = styled.section`
  /* background-color: green; */
  grid-template-columns: 15fr 85fr; //aside main

  flex: 0;
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
  align-items: start;
`;

function AppLayout() {
  return (
    <AppNavContextProvider>
      <StyledAppLayout>
        <Header />

        <Aside>
          <SideBar />
        </Aside>
        <Main>
          <Outlet />
        </Main>
        <Footer />
      </StyledAppLayout>
    </AppNavContextProvider>
  );
}

export default AppLayout;
