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
  /* display: grid; */
  /* grid-template-rows: auto 1fr; Header auto-height, content fills remaining space */
  /* height: 100vh; Full viewport height */
  /* overflow: hidden; */
  //THIS IS FOR THE HEADER< BODY< FOOTER
  /* max-height: 100%; Full viewport height */
  /* display: flex; */
  /* display: grid; */
  /* grid-template-rows: auto 1fr; Header auto-height, content fills remaining space */
  /* /* flex-direction: column; */
  /* overflow: hidden; Prevent overflow of the whole game progress section */
  /* margin: 1rem;
  display: grid;*/
  /* grid-template-rows: 17rem 1fr 4rem; */
  /** align-items: start; */
`;
const Head = styled.header`
  background-color: var(--color-grey-0);
  background-color: red;
  grid-column: 1 / -1;
  grid-row: 1/2;
  position: sticky;
  width: 100%;
  top: 0;
  z-index: 900;
`;
const Aside = styled.aside`
  background-color: blue;
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
        <Head>
          <Header />
        </Head>
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
