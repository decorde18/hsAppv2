import { useCallback, useState } from 'react';

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
  const [periodCreationInProgress, setPeriodCreationInProgress] =
    useState(false);

  const createPeriod = useCallback(
    (newData) => {
      const periodData = { game: gameId, ...newData };
      if (periodCreationInProgress || !newData) return;
      setPeriodCreationInProgress(true);
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
            setPeriodCreationInProgress(false);
          },
        }
      );
    },
    [createData, gameId, periodCreationInProgress, updateGameArrays]
  );

  const updatePeriod = useCallback(
    (newData, period) => {
      updateData(
        {
          table: 'periods',
          newData,
          id: period || currentPeriod.id,
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
      deleteData(
        {
          table: 'periods',
          id: currentPeriodId,
          toast: false,
        },
        {
          onSuccess: () => {
            updateGameArrays({
              field: 'periods',
              value: { id: currentPeriodId },
              deleteItem: true,
            });
          },
        }
      );
    },
    [deleteData, updateGameArrays]
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
    manualNewPeriod: (data) => createPeriod(data),
    endPeriod: () => updatePeriod({ end: getCurrentTime() }),
    startPeriod: (data) => updatePeriod({ start: data.start }),
    updatePeriod,
    deletePeriod,
  };
  return {
    periodHandle,
  };
};
