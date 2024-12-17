import { useCallback } from 'react';

export const useDiscipline = ({
  createData,
  updateData,
  deleteData,
  updateGame,
  gameDataArrays,
  gameData,
  getGameTime,
  setGameDataArrays,
}) => {
  const createDiscipline = useCallback((data) => {}, []);

  const updateDiscipline = useCallback((newData, extraDetails) => {}, []);

  const deleteDiscipline = useCallback(() => {}, []);
  const disciplineHandle = {};

  return {
    disciplineHandle,
  };
};
