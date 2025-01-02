import { useCallback } from 'react';

export const useStoppages = ({
  createData,
  updateData,
  deleteData,
  updateGame,
  gameDataArrays,
  gameData,
  getGameTime,
}) => {
  const createStoppage = useCallback(
    (newData) => {
      const begin = getGameTime.gameTime();
      const clockStopped =
        Math.abs(gameDataArrays.game.gf - gameDataArrays.game.ga) < 5;
      //type is which kind of stopppage
      const status = {
        event: newData,
        begin,
        periodId: gameData.currentPeriod.id,
        clockStopped,
      };

      createData(
        {
          table: 'stoppages',
          newData: status,
          toast: false,
        },
        {
          onSuccess: (data) =>
            updateGame({
              field: 'stoppageStatus',
              value: data.data[0],
            }),
        }
      );
    },
    [createData, gameData, gameDataArrays, getGameTime, updateGame]
  );

  const updateStoppage = useCallback(
    (newData, extraDetails, id) => {
      id = id || gameData.stoppageStatus.id;
      updateData({
        table: 'stoppages',
        newData,
        id,
      });
    },
    [gameData.stoppageStatus.id, updateData]
  );

  const deleteStoppage = useCallback(() => {
    const id = gameData.stoppageStatus.id;
    updateGame({ field: 'stoppageStatus', value: false });

    deleteData({
      table: 'stoppages',
      id,
      toast: false,
    });
  }, [deleteData, gameData.stoppageStatus.id, updateGame]);
  const stoppageHandle = {
    newStoppage: (data) => {
      updateGame({ field: 'stoppageStatus', value: true });
      createStoppage(data);
    },
    updateStoppage: (data) => {
      const newData = { ...gameData.stoppageStatus, ...data };
      updateGame({ field: 'stoppageStatus', value: newData });
      updateStoppage(data);
    },
    updateClockStopped: () => {
      const clockStopped = !gameData.stoppageStatus.clockStopped;
      const newData = { ...gameData.stoppageStatus, clockStopped };
      updateGame({
        field: 'stoppageStatus',
        value: newData,
      });
      updateStoppage({ clockStopped });
    },
    saveStoppage: (details) => {
      const end = getGameTime.gameTime();
      updateGame({ field: 'stoppageStatus', value: false });
      updateStoppage({ end, details });
    },
    cancelStoppage: () => deleteStoppage(),
    endStoppage: (data) => updateStoppage(data),
  };
  return {
    stoppageHandle,
  };
};
