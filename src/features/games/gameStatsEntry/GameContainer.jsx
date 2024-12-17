import { useEffect, useState } from 'react';

import { useGameContext } from '../../../contexts/GameContext';

import GameHeader from './GameHeader';
import { GameProgress } from './GameProgress';
import styled from 'styled-components';
import ModalGamesEdit from './modalGamesEdit/ModalGamesEdit';
import ModalGames from './modalGames/ModalGames';
import { useSearchParams } from 'react-router-dom';
import { ClockProvider } from '../../../contexts/ClockContext';

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

function GameContainer() {
  const [searchParams] = useSearchParams();
  const editGame = searchParams.get('edit');

  const { gameData, getGameTime } = useGameContext();
  const { currentPeriod, gameProgress } = gameData;
  const { stoppageStatus } = gameData;

  const [modalOpen, setModalOpen] = useState(false);

  // open Modal if stoppage
  useEffect(() => {
    if (stoppageStatus) setModalOpen(true);
    else setModalOpen(false);
  }, [stoppageStatus]);

  return (
    <ClockProvider
      getGameTime={getGameTime}
      gameProgress={gameProgress}
      currentPeriod={currentPeriod}
    >
      {editGame && <ModalGamesEdit />}
      {modalOpen && <ModalGames />}

      <Container>
        <Header>
          <GameHeader />
        </Header>
        <Main>
          <GameProgress />
        </Main>
      </Container>
    </ClockProvider>
  );
}

export default GameContainer;
