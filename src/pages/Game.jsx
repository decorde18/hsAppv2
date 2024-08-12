import GameHeader from '../features/games/gameStatsEntry/GameHeader';

import { GameProgress } from '../features/games/gameStatsEntry/GameProgress';

import styled from 'styled-components';

import { GameContextProvider } from '../contexts/GameContext';
import { useState } from 'react';

const Div = styled.div`
  /* width: 99dvw;*/
  max-height: 100dvh;

  /* overflow: hidden; */
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
`;

function Game() {
  const [gameStatus, setGameStatus] = useState();

  return (
    <GameContextProvider gameStatus={gameStatus} setGameStatus={setGameStatus}>
      <Div>
        <GameHeader gameStatus={gameStatus} />
        <GameProgress gameStatus={gameStatus} setGameStatus={setGameStatus} />
      </Div>
    </GameContextProvider>
  );
}

export default Game;
