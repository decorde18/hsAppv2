import { createContext, useContext, useState, useEffect } from 'react';

import { useCreateData } from '../services/useUniversal';
import { useHandleMissingPlayers } from '../hooks/useHandleMissingPlayers';
import { usePreparePlayerData } from '../hooks/usePreparePlayerData';

import Spinner from '../ui/Spinner';
import { useGameContext } from './GameContext';
import { useSubstitutionHandling } from '../hooks/useSubstitutionHandling';

const PlayerContext = createContext();

function PlayerContextProvider({ playerDetails, gameDetails, children }) {
  const { gameDataArrays, updateGameArrays } = useGameContext();
  const { stoppages } = gameDataArrays;
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
    stoppages,
  }); // Returns player data

  // Populate state when hook data is available
  useEffect(() => {
    if (preparedPlayerData) {
      setPlayers(preparedPlayerData.players);
      setCurrentPlayers(preparedPlayerData.currentPlayers);
    }
  }, [preparedPlayerData]); // Update only when `preparedPlayerData` changes

  const { subHandle } = useSubstitutionHandling({
    subsInWaiting,
    setSubsInWaiting,
    gameSubs,
    setGameSubs,
    updateGameArrays,
  });

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
        subHandle,
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
