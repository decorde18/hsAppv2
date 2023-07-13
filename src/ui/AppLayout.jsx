import SideBar from '../components/SideBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainSection from '../components/MainSection';
import { useSeasons } from '../features/seasons/useSeasons';
// import { useNavigation } from 'react-router-dom';
import Spinner from './Spinner';
import { styled } from 'styled-components';
import { useEffect, useState } from 'react';

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

// const Row = styled.div`
//   display: flex;
//   ${(props) =>
//     props.type === 'horizontal' &&
//     css`
//     `}
//   ${(props) =>
//     props.type === 'vertical' &&
//     css`
//       flex-direction: column;
//       gap:1.6rem
//       justify-content: space-between;
//       align-items: center;
//     `}
// `;

function AppLayout() {
  const [currentSeason, setCurrentSeason] = useState();
  const [recentSeason, setRecentSeason] = useState([]);
  const { isLoadingSeasons, seasons } = useSeasons();
  useEffect(
    function () {
      if (isLoadingSeasons) return;
      setRecentSeason(
        seasons.reduce(
          (season, acc) => (season.season > acc.season ? season : acc),
          []
        )
      );
      if (localStorage.getItem('currentSeason')) {
        setCurrentSeason(localStorage.getItem('currentSeason'));
        return;
      }
      setCurrentSeason(recentSeason?.id);
    },
    [seasons, recentSeason, currentSeason, isLoadingSeasons]
  );
  // const navigation = useNavigation();
  // const isLoading = navigation.state === 'loading';

  if (isLoadingSeasons) return;
  <Spinner />;
  console.log(recentSeason);
  return (
    <StyledAppLayout>
      <Header
        seasonProps={{
          currentSeason,
          recentSeason,
          onChangeSeason: setCurrentSeason,
          seasons,
        }}
        type="app"
      />

      <Main className="flex">
        <SideBar></SideBar>
        <MainSection
          seasonProps={{
            currentSeason,
            recentSeason,
            onChangeSeason: setCurrentSeason,
            seasons,
          }}
        ></MainSection>
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
