import { useCallback } from 'react';

import {
  useCreateData,
  useDeleteData,
  useUpdateData,
} from '../services/useUniversal';

/**
 * Custom hook to handle substitutions in a game.
 * @param {Object} params - Parameters for substitution handling.
 * @param {Array} params.subsInWaiting - List of substitutions waiting to be executed.
 * @param {Function} params.setSubsInWaiting - Setter function for subsInWaiting state.
 * @param {Function} params.updateCurrentPlayers - Function to update the list of current players.
 * @param {Array} params.gameSubs - List of substitutions that have been executed in the game.
 * @param {Function} params.setGameSubs - Setter function for gameSubs state.
 */
export function useSubstitutionHandling({
  subsInWaiting,
  setSubsInWaiting,
  setGameSubs,
  updateGameArrays,
}) {
  const { createData } = useCreateData();
  const { updateData } = useUpdateData();
  const { deleteData } = useDeleteData();

  /**
   * Create a new substitution and add it to subsInWaiting.
   * @param {Object} newSubData - Data for the new substitution.
   */
  const createSub = (newSubData) => {
    const { periodId, type, player, game } = newSubData;

    try {
      createData(
        {
          table: 'subs',
          newData: {
            periodId,
            [type]: player,
            game,
          },
          toast: false,
        },
        {
          onSuccess: (data) => {
            setSubsInWaiting((prev) => [
              ...prev.filter((sub) => !sub.gameMinute && sub.id),
              data.data[0],
              { id: null, subIn: null, subOut: null },
            ]);
          },
          onError: (error) => {
            console.error('Error creating substitution:', error);
          },
        }
      );
    } catch (error) {
      console.error('Unexpected error while creating substitution:', error);
    }
  };
  const createSubManual = (newData) => {
    try {
      createData(
        {
          table: 'subs',
          newData,
          toast: false,
        },
        {
          onSuccess: (data) => {
            setSubsInWaiting((prev) => [
              ...prev.filter((sub) => !sub.gameMinute && sub.id),
              data.data[0],
              { id: null, subIn: null, subOut: null },
            ]);
          },
          onError: (error) => {
            console.error('Error creating substitution:', error);
          },
        }
      );
    } catch (error) {
      console.error('Unexpected error while creating substitution:', error);
    }
  };

  /**
   * Update an existing substitution in subsInWaiting.
   * @param {Object} param0 - Parameters for updating a substitution.
   * @param {Object} param0.updatedSub - The updated substitution data.
   */
  const updateSubManual = (newData, id) => {
    try {
      // Update the local state
      const updatedSubs = subsInWaiting.map((sub) =>
        sub.id === id ? { id, ...newData } : sub
      );
      setSubsInWaiting(updatedSubs);

      updateData(
        {
          table: 'subs',
          newData,
          id,
        },
        {
          onError: (error) => {
            console.error('Error updating substitution:', error);
          },
        }
      );
    } catch (error) {
      console.error('Unexpected error while updating substitution:', error);
    }
  };
  const updateSub = ({ updatedSub }) => {
    console.log(updatedSub);
    try {
      // Update the local state
      const updatedSubs = subsInWaiting.map((sub) =>
        sub.id === updatedSub.id ? updatedSub : sub
      );
      setSubsInWaiting(updatedSubs);

      // Update the data on the server
      const { id, ...newData } = updatedSub;
      updateData(
        {
          table: 'subs',
          newData,
          id,
        },
        {
          onError: (error) => {
            console.error('Error updating substitution:', error);
          },
        }
      );
    } catch (error) {
      console.error('Unexpected error while updating substitution:', error);
    }
  };

  /**
   * Delete a substitution from subsInWaiting.
   * @param {number} index - Index of the substitution to delete.
   */
  const cancelSub = (index) => {
    try {
      const sub = subsInWaiting[index];
      const updatedSubList = subsInWaiting.filter((_, i) => i !== index);
      setSubsInWaiting(updatedSubList);
      // Remove the substitution from gameSubs as well
      setGameSubs((prev) => prev.filter((gameSub) => gameSub.id !== sub.id));

      deleteData(
        {
          table: 'subs',
          id: sub.id,
          toast: false,
        },
        {
          onError: (error) => {
            console.error('Error deleting substitution:', error);
          },
        }
      );
    } catch (error) {
      console.error('Unexpected error while deleting substitution:', error);
    }
  };

  const deleteSub = useCallback(
    (id) => {
      setGameSubs((prev) => prev.filter((gameSub) => gameSub.id !== id));
      try {
        deleteData(
          { table: 'subs', id, toast: false },
          {
            onSuccess: () => {
              updateGameArrays({
                field: 'subs',
                value: { id },
                deleteItem: true,
              });
            },
          },
          {
            onError: (error) => {
              console.error('Error deleting substitution:', error);
            },
          }
        );
      } catch (error) {
        console.error('Unexpected error while deleting substitution:', error);
      }
    },
    [deleteData, setGameSubs, updateGameArrays]
  );
  /**
   * Execute a substitution and move it from subsInWaiting to gameSubs.
   * @param {number} index - Index of the substitution in subsInWaiting.
   * @param {Object} clickedSub - Substitution data.
   * @param {number} gameMinute - Minute of the game when the substitution occurs.
   */
  const enterSub = (index, clickedSub, gameMinute) => {
    try {
      // Update the substitution with the game minute
      updateData(
        {
          table: 'subs',
          newData: { gameMinute },
          id: clickedSub.id,
        },
        {
          onError: (error) => {
            console.error('Error entering substitution:', error);
          },
        }
      );
      // Update the gameSubs state
      setGameSubs((prev) => [...prev, { ...clickedSub, gameMinute }]);

      // Remove the substitution from subsInWaiting
      const updatedSubList = subsInWaiting.filter((_, i) => i !== index);
      setSubsInWaiting(updatedSubList);
    } catch (error) {
      console.error('Unexpected error while entering substitution:', error);
    }
  };

  /**
   * Execute all substitutions in subsInWaiting for a given period.
   * @param {number} periodId - ID of the current period.
   * @param {number} gameMinute - Minute of the game when the substitutions occur.
   */
  const enterAllSubs = ({ periodId, gameMinute }) => {
    try {
      subsInWaiting.forEach((sub, index) => {
        if (sub.subIn && sub.subOut) {
          updateData(
            {
              table: 'subs',
              newData: { gameMinute, periodId },
              id: sub.id,
            },
            {
              onError: (error) => {
                console.error('Error entering all substitutions:', error);
              },
            }
          );

          // Move each substitution to gameSubs
          setGameSubs((prev) => [...prev, { ...sub, gameMinute, periodId }]);
        }
      });

      // Remove only completed substitutions from subsInWaiting
      setSubsInWaiting((prev) =>
        prev.filter((sub) => !sub.subIn || !sub.subOut)
      );
    } catch (error) {
      console.error(
        'Unexpected error while entering all substitutions:',
        error
      );
    }
  };
  const subHandle = {
    createSub,
    createSubManual,
    updateSub,
    updateSubManual,
    cancelSub,
    deleteSub,
    enterSub,
    enterAllSubs,
  };
  return {
    subHandle,
  };
}
