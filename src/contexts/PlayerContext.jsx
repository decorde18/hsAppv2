import { createContext, useContext, useState, useEffect } from 'react';

import { useCreateData } from '../services/useUniversal';
import { useHandleMissingPlayers } from '../hooks/useHandleMissingPlayers';
import { usePreparePlayerData } from '../hooks/usePreparePlayerData';

import Spinner from '../ui/Spinner';

const PlayerContext = createContext();

function PlayerContextProvider({ playerDetails, gameDetails, children }) {
  const { playerGame, playerSeason } = playerDetails;
  const { game, subs } = gameDetails;

  const { isCreating, createData } = useCreateData();

  const missingPlayers = useHandleMissingPlayers(
    playerSeason,
    playerGame,
    game.id,
    createData
  );
  const [players, setPlayers] = useState([]);
  const [currentPlayers, setCurrentPlayers] = useState({
    onField: [],
    offField: [],
  });
  const [gameSubs, setGameSubs] = useState(subs);
  const [subsInWaiting, setSubsInWaiting] = useState([
    ...gameSubs.filter((sub) => !sub.gameMinute),
    { id: null, subIn: null, subOut: null },
  ]);

  // Using the custom hooks
  const preparedPlayerData = usePreparePlayerData({
    playerGame,
    playerSeason,
    subs: gameSubs,
    gameTime: game.actualgametime,
  }); // Returns player data

  // const updateCurrentPlayers = useCallback((subDetails, gameTime) => {
  //   const { subIn, subOut } = subDetails;

  //   // setCurrentPlayers((prev) => {
  //   //   const onField = prev.onField.filter((p) => p.playerid !== subOut);
  //   //   const offField = prev.offField.filter((p) => p.playerid !== subIn);

  //   //   const updatedOnField = [
  //   //     ...onField,
  //   //     {
  //   //       ...prev.offField.find((p) => p.playerid === subIn),
  //   //       lastIn: gameTime,
  //   //     },
  //   //   ];

  //   //   const updatedOffField = [
  //   //     ...offField,
  //   //     {
  //   //       ...prev.onField.find((p) => p.playerid === subOut),
  //   //       lastOut: gameTime,
  //   //     },
  //   //   ];

  //   //   return {
  //   //     onField: updatedOnField,
  //   //     offField: updatedOffField,
  //   //   };
  //   // });
  // }, []);
  // const addSubToWaitingList = useCallback((sub) => {
  //   setSubsInWaiting((prev) => [...prev, sub]);
  // }, []);

  // Populate state when hook data is available
  useEffect(() => {
    if (preparedPlayerData) {
      setPlayers(preparedPlayerData.players);
      setCurrentPlayers(preparedPlayerData.currentPlayers);
    }
  }, [preparedPlayerData]); // Update only when `preparedPlayerData` changes

  if (missingPlayers || isCreating || !players.length) return <Spinner />;
  return (
    <PlayerContext.Provider
      value={{
        players,
        currentPlayers,
        subsInWaiting,
        setSubsInWaiting,
        gameSubs,
        setGameSubs,
        // updateCurrentPlayers,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

function usePlayerContext() {
  const context = useContext(PlayerContext);
  if (context === undefined)
    throw new Error('PlayerContext must be used within PlayerContextProvider');
  return context;
}

export { PlayerContextProvider, usePlayerContext };
