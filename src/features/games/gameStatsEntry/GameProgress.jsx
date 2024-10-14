import { useCreateData, useUpdateData } from '../../../services/useUniversal';
import { getCurrentTime } from '../../../utils/helpers';

import GameAfter from './GameAfter';
import GameDuring from './GameDuring';
import GameBefore from './GameBefore';

import styled from 'styled-components';
import { useGameContext } from '../../../contexts/GameContext';
import {
  PlayerContextProvider,
  usePlayerContext,
} from '../../../contexts/PlayerContext';
import GamePeriodBreak from './GamePeriodBreak';
import { useEffect, useState } from 'react';
import ModalGames from './modalGames/ModalGames';

const Container = styled.div`
  /* display: inline-block; */
  overflow: hidden;
`;

function GameProgress() {
  const {
    getGameTime,
    gameDetails,
    setGameDetails,
    currentPeriod,
    setCurrentPeriod,
    gameStatus,
    setGameStatus,
    minorEventCategories,
    setMinorEventCategories,
  } = useGameContext();
  const { enterAllSubs } = usePlayerContext();
  const {
    game,
    periods,
    // minorEventCategories,
    // gameStatus,
    // setGameStatus,
  } = gameDetails;

  const [modalOpen, setModalOpen] = useState(false);

  const { isCreating, createData } = useCreateData();
  const { isUpdating, updateData } = useUpdateData();

  //todo updateStoppages open on any stoppage without end
  useEffect(() => {
    if (gameDetails.stoppageStatus) setModalOpen(true);
    else setModalOpen(false);
    if (gameDetails.stoppages.data?.some((stoppage) => !stoppage.end))
      setModalOpen(true);
  }, [gameDetails.stoppageStatus, gameDetails.stoppages.data]);

  function handleStartGame() {
    // setGameData(() => ({ ...game, status: 'in progress' }));
    setGameDetails(() => ({
      ...gameDetails,
      gameStatus: 'periodActive',
      game: { ...game, status: 'in progress' },
    }));

    // updateData({
    //   table: 'games',
    //   newData: [{ status: 'in progress' }],
    //   id: game.id,
    // });
    // createPeriod({ period: 1, default_time: game.reg_periods_minutes });
  }
  function startNextPeriod() {
    const period = currentPeriod.period + 1;
    createPeriod({ period, default_time: game.reg_periods_minutes });
  }
  function createPeriod({ period, default_time }) {
    setGameStatus('periodActive');
    setCurrentPeriod(() => ({
      game: game.id,
      period,
      start: getCurrentTime(),
      end: null,
      default_time,
    }));
    createData(
      {
        table: 'periods',
        newData: {
          game: game.id,
          period,
          start: getCurrentTime(),
          default_time,
        },
        view: 'periods',
        toast: false,
      },
      {
        onSuccess: (data) => {
          enterAllSubs(data.data[0].id);
        },
      }
    );
  }
  function endPeriod() {
    setGameStatus('betweenPeriods');
    setCurrentPeriod({
      ...currentPeriod,
      end: getCurrentTime(),
    });
    updateData({
      table: 'periods',
      newData: [{ end: getCurrentTime() }],
      id: currentPeriod.id,
    });
  }
  function updateStates({ state, data }) {
    const gameMinute = getGameTime();
    const gameId = game.id;
    const periodId = periods[0].id;
    if (state === 'minorEventCategories') {
      const newData = {
        eventType: data.type,
        team: data.section,
        gameMinute,
        periodId,
        // player, //todo add this for shots, saves only
      };
      const newEvent = {
        [data.section]: {
          ...minorEventCategories[data.section],
          [data.type]: [
            ...minorEventCategories[data.section][data.type],
            { periodId, game: gameId, gameMinute },
            //todo on shot, need more information to get the player number
          ],
        },
      };
      setMinorEventCategories({
        ...minorEventCategories,
        ...newEvent,
      });

      createData({ table: 'minorEvents', newData, toast: false });
    }
  }

  const isWorking = isCreating || isUpdating;
  return (
    <>
      {modalOpen && <ModalGames />}
      <Container>
        {(() => {
          switch (gameStatus) {
            case 'endGame':
              return <GameAfter isWorking={isWorking} />;
            case 'beforeGame':
              return (
                <GameBefore
                  handleStartGame={handleStartGame}
                  isWorking={isWorking}
                />
              );
            case 'betweenPeriods':
              return <GamePeriodBreak startNextPeriod={startNextPeriod} />;
            default:
              return (
                <GameDuring
                  updateStates={updateStates}
                  isWorking={isWorking}
                  endPeriod={endPeriod}
                />
              );
          }
        })()}
      </Container>
    </>
  );
  //TODO Modal for stats edit - needed for game during and game after
}

export { GameProgress };
