import { useCallback } from 'react';

export const usePeriods = ({
  gameId,
  createData,
  updateData,
  deleteData,
  gameDataArrays,
  updateGameArrays,
  currentPeriod,
  getCurrentTime,
}) => {
  const createPeriod = useCallback(
    (newData) => {
      const periodData = { game: gameId, ...newData };
      createData(
        {
          table: 'periods',
          newData: periodData,
          view: 'periods',
          toast: false,
        },
        {
          onSuccess: (data) => {
            updateGameArrays({ field: 'periods', value: data.data[0] });
          },
        }
      );
    },
    [createData, gameId, updateGameArrays]
  );

  const updatePeriod = useCallback(
    (newData) => {
      updateData(
        {
          table: 'periods',
          newData,
          id: currentPeriod.id,
        },
        {
          onSuccess: (data) => {
            updateGameArrays({ field: 'periods', value: data.data[0] });
          },
        }
      );
    },
    [currentPeriod, updateData, updateGameArrays]
  );

  const deletePeriod = useCallback(
    (currentPeriodId) => {
      deleteData({
        table: 'periods',
        id: currentPeriodId,
        toast: false,
      });
    },
    [deleteData]
  );
  const periodHandle = {
    startGame: () =>
      createPeriod({
        period: 1,
        start: getCurrentTime(),
        default_time: gameDataArrays.game.reg_periods_minutes,
      }),
    newPeriod: (data) =>
      createPeriod({
        period: data.period,
        default_time: data.default_time,
      }),
    endPeriod: () => updatePeriod({ end: getCurrentTime() }),
    startPeriod: (data) => updatePeriod({ start: data.start }),
    updatePeriod,
    deletePeriod,
  };
  return {
    periodHandle,
  };
};
