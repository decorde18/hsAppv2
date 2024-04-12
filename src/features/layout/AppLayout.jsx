import { styled } from 'styled-components';

import SideBar from './SideBar';
import Header from './Header';
import Footer from './Footer';

import { Outlet } from 'react-router-dom';

const StyledAppLayout = styled.div`
  //THIS IS FOR THE HEADER< BODY< FOOTER
  height: 100vh;
  display: grid;
  grid-template-columns: 15fr 85fr; //aside main
  overflow: hidden;
  align-items: start;
`;
const Head = styled.header`
  background-color: var(--color-grey-0);
  /* background-color: red; */
  grid-column: 1 / -1;
  grid-row: 1/2;
  position: sticky;
  width: 100%;
  top: 0;
  z-index: 900;
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
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
  align-items: start;
`;

function AppLayout() {
  return (
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
  );
}

export default AppLayout;
