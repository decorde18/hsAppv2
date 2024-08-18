import GameHeader from '../features/games/gameStatsEntry/GameHeader';

import { GameProgress } from '../features/games/gameStatsEntry/GameProgress';

import styled from 'styled-components';

import { GameContextProvider } from '../contexts/GameContext';
import { useState } from 'react';

const Container = styled.div`
  max-height: 100dvh;
  padding: 0.5rem;
  display: grid;
  grid-template-rows: 12.5rem 1fr;
  overflow: hidden;
`;

function Game() {
  const [gameStatus, setGameStatus] = useState();

  return (
    <GameContextProvider gameStatus={gameStatus} setGameStatus={setGameStatus}>
      <Container>
        <GameHeader gameStatus={gameStatus} />
        <GameProgress gameStatus={gameStatus} setGameStatus={setGameStatus} />
      </Container>
    </GameContextProvider>
  );
}

export default Game;
