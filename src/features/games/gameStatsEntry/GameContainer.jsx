import { useEffect, useState } from 'react';

import { useGameContext } from '../../../contexts/GameContext';

import GameHeader from './GameHeader';
import { GameProgress } from './GameProgress';
import styled from 'styled-components';
import ModalGamesEdit from './modalGamesEdit/ModalGamesEdit';
import ModalGames from './modalGames/ModalGames';
import { useSearchParams } from 'react-router-dom';

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr; /* Header auto-height, content fills remaining space */
  max-height: 100vh; /* Full viewport height */
  overflow: hidden;
`;
const Header = styled.header`
  text-align: center;
  min-height: 12.5rem;
`;
const Main = styled.main`
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Prevent overflow of the whole game progress section */
  height: 100%;
  margin: 1rem;
`;

function GsmeContainer() {
  const [searchParams] = useSearchParams();
  const editGame = searchParams.get('edit');

  const { gameData, getGameTime } = useGameContext();
  const { currentPeriod, gameProgress } = gameData;
  const { stoppageStatus } = gameData;

  const [currentPeriodTime, setCurrentPeriodTime] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);

  // open Modal if stoppage
  useEffect(() => {
    if (stoppageStatus) setModalOpen(true);
    else setModalOpen(false);
  }, [stoppageStatus]);

  useEffect(() => {
    //start scoreboard clock
    if (!currentPeriod) return;

    if (gameProgress === 'periodActive') {
      const interval = setInterval(() => {
        setCurrentPeriodTime(getGameTime.periodTime());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentPeriod, gameProgress, getGameTime]);

  return (
    <>
      {editGame && <ModalGamesEdit />}
      {modalOpen && <ModalGames currentPeriodTime={currentPeriodTime} />}

      <Container>
        <Header>
          <GameHeader currentPeriodTime={currentPeriodTime} />
        </Header>
        <Main>
          <GameProgress />
        </Main>
      </Container>
    </>
  );
}

export default GsmeContainer;
