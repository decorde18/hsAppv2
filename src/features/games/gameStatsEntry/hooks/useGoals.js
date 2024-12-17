import { useCallback } from 'react';

export const useGoals = ({
  createData,
  updateData,
  deleteData,
  updateGame,
  gameDataArrays,
  gameData,
  getGameTime,
  setGameDataArrays,
}) => {
  const createGoal = useCallback((data) => {}, []);

  const updateGoal = useCallback((newData, extraDetails) => {}, []);

  const deleteGoal = useCallback(() => {}, []);
  const goalHandle = {
    createGoal: (goalScored, details) => {
      const end = getGameTime.gameTime();
      const team = gameData.stoppageStatus.team;
      const event = team === 'for' ? 'Goal Scored' : 'Goal Against';
      const { goal, ...extraDetails } = goalScored;

      updateGame({ field: 'stoppageStatus', value: false });

      if (team === 'for') {
        //todo I AM HERE,
        updateGame({
          field: 'game',
          value: {
            ...gameDataArrays,
            game: { ...gameDataArrays.game, gf: gameDataArrays.game.gf++ },
          },
        });
        //todo send to server
        // updateStoppage({ event, end, details }, extraDetails);
      } else {
        updateGame({
          field: 'game',
          value: {
            ...gameDataArrays,
            game: { ...gameDataArrays.game, ga: gameDataArrays.game.ga++ },
          },
        });
        //todo send to server
      }
    },
  };
  return {
    goalHandle,
  };
};
