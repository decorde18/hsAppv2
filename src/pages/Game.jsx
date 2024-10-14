import GameHeader from '../features/games/gameStatsEntry/GameHeader';

import { GameProgress } from '../features/games/gameStatsEntry/GameProgress';

import styled from 'styled-components';

import { GameContextProvider } from '../contexts/GameContext';
import { PlayerContextProvider } from '../contexts/PlayerContext';

const MainContainer = styled.div`
  max-height: 100dvh;
  padding: 0.5rem;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
`;
const Container = styled.div`
  flex: 0 0 100%;
  display: grid;
  grid-template-rows: 12.5rem 1fr;
  align-items: stretch;
`;
function Game() {
  return (
    <GameContextProvider>
      <PlayerContextProvider>
        <MainContainer>
          <Container>
            <GameHeader />
            <GameProgress />
          </Container>
        </MainContainer>
      </PlayerContextProvider>
    </GameContextProvider>
  );
}

export default Game;
