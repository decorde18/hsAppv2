import styled from 'styled-components';
import { StatsNavContextProvider } from '../contexts/StatsNavContext';

import StatsHeader from '../features/statsViewPages/layout/StatsHeader';
import StatsSideBar from '../features/statsViewPages/layout/StatsSideBar';
import StatsPagePicker from '../features/statsViewPages/StatsPagePicker';

const Container = styled.div`
  display: grid;
  grid-template-rows: 5.5rem 1fr;
  grid-template-columns: 15fr 85fr; //aside main
  height: 100%;
  overflow: hidden;
  /* background-color: red; */
`;
const Head = styled.header`
  background-color: var(--color-grey-0);
  grid-column: 1 / -1;
  grid-row: 1/2;
  position: sticky;
  top: 0;
  overflow-x: auto;
  z-index: 900;
`;
const Aside = styled.aside`
  /* background-color: blue; */
  grid-row: 2 / -1;
  position: sticky;
  margin: 1rem auto;
  padding-bottom: 1rem;
  overflow-y: auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Main = styled.section`
  grid-column: 2 / -1;
  grid-row: 2/-1;
  /* background-color: yellow; */
  flex: 0;
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
  align-items: start;
`;

function Stats() {
  return (
    <StatsNavContextProvider>
      <Container>
        <Head>
          <StatsHeader />
        </Head>
        <Aside>
          <StatsSideBar />
        </Aside>
        <Main>
          <StatsPagePicker />
        </Main>
      </Container>
    </StatsNavContextProvider>
  );
}

export default Stats;
