import { useCallback } from 'react';

export const useGoals = ({
  createData,
  updateData,
  deleteData,
  gameData,
  getGameTime,
  stoppageHandle,
}) => {
  const createGoal = useCallback(
    (data) => {
      const { team, ...newData } = data;
      const table = team === 'for' ? 'goalsFor' : 'goalsAgainst';
      createData(
        {
          table,
          newData,
          toast: false,
        },
        {
          onSuccess: (data) => {
            console.log(data);
          },
        }
      );
    },
    [createData]
  );

  const updateGoal = useCallback((newData, extraDetails) => {
    console.log('todo - update goal');
  }, []);

  const deleteGoal = useCallback(() => {
    console.log('todo - delete goal');
  }, []);
  const goalHandle = {
    createGoal: (goalScored, details) => {
      const end = getGameTime.gameTime();
      const id = gameData.stoppageStatus.id;
      const team = gameData.stoppageStatus.team;
      const event = team === 'for' ? 'Goal Scored' : 'Goal Against';
      const { goal, ...extraDetails } = goalScored;
      const goalData = { ...extraDetails, eventId: id, team };

      stoppageHandle.updateStoppage({ event, end, details, team });

      createGoal(goalData);
    },
  };
  return {
    goalHandle,
  };
};
