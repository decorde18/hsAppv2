import { useGameContext } from '../../../contexts/GameContext';

import GameBefore from './GameBefore';
import GameDuring from './GameDuring';
import GamePeriodBreak from './GamePeriodBreak';
import GameAfter from './GameAfter';
import GameShootout from './GameShootout';

import { useState } from 'react';
import Spinner from '../../../ui/Spinner';

function GameProgress() {
  const { gameData } = useGameContext();
  return (
    <>
      {(() => {
        switch (gameData.gameProgress) {
          case 'pending':
            return <Spinner />;
          case 'endGame':
            return <GameAfter />;
          case 'beforeGame':
            return <GameBefore />;
          case 'betweenPeriods':
            return <GamePeriodBreak />;
          case 'shootout':
            return <GameShootout />;
          default:
            return <GameDuring />;
        }
      })()}
    </>
  );
}

export { GameProgress };
