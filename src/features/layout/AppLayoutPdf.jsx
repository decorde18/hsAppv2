import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

import { styled } from 'styled-components';
import { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Spinner from '../../ui/Spinner';

const StyledAppLayout = styled.div`
  /* height: 100vh;
  overflow: clip;
  display: grid;
  grid-template-rows: 15rem 1fr auto; */
`;

export const AppContext = createContext();

function AppLayoutPdf() {
  const { currentSeason } = useCurrentSeason();
  if (!currentSeason) return <Spinner />;

  return (
    <StyledAppLayout>
      <Outlet></Outlet>
    </StyledAppLayout>
  );
}

export default AppLayoutPdf;

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
