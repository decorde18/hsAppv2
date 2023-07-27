import SideBar from '../components/SideBar';
import Header from './Header';
import Footer from '../components/Footer';
import MainSection from '../components/MainSection';

import { styled } from 'styled-components';
import { createContext, useState } from 'react';

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

function AppLayout({ currentSeason, setCurrentSeason }) {
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

// const Main = styled.main`
//   background-color: var(--color-grey-50);
//   padding: 4rem 4.8rem 6.4rem;
//   overflow: auto;
// `;
// const StyledAppLayout = styled.div`
//   display: grid;
//   grid-template-columns: 26rem 1fr;
//   grid-template-rows: auto 1fr;
//   height: 100vh;
// `;
// const Container = styled.div`
//   max-width: 120rem;
//   margin: 0 auto;
//   display: flex;
//   flex-direction: column;
//   gap: 3.2rem;
// `;
// function AppLayout() {
//   return (
//     <StyledAppLayout>
//       <Header />
//       <Sidebar />
//       <Main>
//         <Container>
//           <Outlet />
//         </Container>
//       </Main>
//     </StyledAppLayout>
//   );
// }

// export default AppLayout;
