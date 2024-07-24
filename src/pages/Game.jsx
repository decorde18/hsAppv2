import { useSearchParams } from 'react-router-dom';

import Spinner from '../ui/Spinner';

import GameHeader from '../features/games/gameStatsEntry/GameHeader';
import GameSettings from '../features/games/gameStatsEntry/GameSettings';
import { GameProgress } from '../features/games/gameStatsEntry/GameProgress';

// import GameStatsEdit from '../features/games/gameStatsEntry/GameStatsEdit';
import { useData } from '../services/useUniversal';
import { useEffect, useState, createContext, useContext } from 'react';

import styled from 'styled-components';
import {
  converthmsToSecondsOnly,
  getCurrentTime,
  subtractTime,
} from '../utils/helpers';
import { GameContextProvider } from '../contexts/GameContext';

const Div = styled.div`
  height: 100%;
  padding: 1rem;
`;

function Game() {
  // const {
  //   periods,
  //   currentPeriod,
  //   game,
  //   minorEventCategories,
  //   setGameData,
  //   setCurrentPeriod,
  //   setMinorEventCategories,
  // } = useContext(GameContext);

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
