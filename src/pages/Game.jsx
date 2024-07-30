import GameHeader from '../features/games/gameStatsEntry/GameHeader';

import { GameProgress } from '../features/games/gameStatsEntry/GameProgress';

import styled from 'styled-components';

import { GameContextProvider } from '../contexts/GameContext';

const Div = styled.div`
  height: 100%;
  padding: 1rem;
`;

function Game() {
  return (
    <GameContextProvider>
      <Div>
        <GameHeader />
        <GameProgress />
      </Div>
    </GameContextProvider>
  );
}

export default Game;
