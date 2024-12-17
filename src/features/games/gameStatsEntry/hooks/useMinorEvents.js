import { useCallback } from 'react';

export const useMinorEvents = ({
  createData,
  updateData,
  deleteData,
  updateGame,
  gameDataArrays,
  gameData,
  getGameTime,
  setGameDataArrays,
}) => {
  const createMinorEvent = useCallback((data) => {
    const { type, section } = data;
    const gameMinute = getGameTime.gameTime();
    const periodId = gameData.currentPeriod.id;

    setGameDataArrays((prev) => ({
      ...gameDataArrays,
      minorEvents: {
        ...prev.minorEvents,
        [section]: {
          ...prev.minorEvents[section],
          [type]: [
            ...prev.minorEvents[section][type],
            { gameMinute, eventType: type, team: section, periodId },
          ],
        },
      },
    }));
    const newData = {
      eventType: type,
      team: section,
      gameMinute,
      periodId,
    };
    createData({
      table: 'minorEvents',
      newData,
      toast: false,
    });
  }, []);

  const updateMinorEvent = useCallback((newData, extraDetails) => {}, []);

  const deleteMinorEvent = useCallback(() => {}, []);
  const minorEventHandle = {
    createMinorEvent,
    updateMinorEvent,
    deleteMinorEvent,
  };
  return {
    minorEventHandle,
  };
};
