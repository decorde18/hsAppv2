import { useEffect, useState, createContext, useContext, useRef } from 'react';

import { useGameContext } from './GameContext';

import {
  useCreateData,
  useData,
  useUpdateData,
} from '../services/useUniversal';

import { converthmsToSecondsOnly } from '../utils/helpers';

import Spinner from '../ui/Spinner';

const PlayerContext = createContext();

function PlayerContextProvider({ children }) {
  const { gameDataArrays, gameData, getGameTime } = useGameContext();
  const { game, subs } = gameDataArrays;
  const { gameStatus } = gameData;
  const { isCreating, createData } = useCreateData();
  const { isUpdating, updateData } = useUpdateData();

  const allPlayers = useRef([]);
  const activeGamePlayers = useRef([]);
  const missingPlayers = useRef(false);

  const [currentPlayers, setCurrentPlayers] = useState();
  const [subsInWaiting, setSubsInWaiting] = useState([]);

  // Fetch player data
  const playerGame = useData({
    table: 'playerGames',
    filter: [{ field: 'game', value: game.id, table: 'playerGames' }],
  });
  const playerSeason = useData({
    table: 'playerSeasons',
    filter: [
      { field: 'seasonId', value: game.seasonId, table: 'playerSeason' },
      { field: 'status', value: 'Rostered', table: 'playerSeason' },
    ],
  });

  // Helper: Check loading states
  const isLoading = playerGame.isLoading || playerSeason.isLoading;

  // Helper: Create missing player data
  const handleMissingPlayers = () => {
    const missing = playerSeason.data
      .filter((playerS) =>
        playerGame.data.every(
          (playerG) => playerG.playerId !== playerS.playerId
        )
      )
      .map((playerS) => ({
        player: playerS.playerId,
        game: game.id,
        status: playerS.teamLevel.includes('Varsity')
          ? 'dressed'
          : 'notDressed',
      }));

    if (missing.length > 0) {
      missingPlayers.current = missing;
      createData(
        {
          table: 'playerGames',
          newData: missing,
          bulk: true,
          toast: false,
        },
        {
          onSuccess: () => {
            missingPlayers.current = false;
          },
        }
      );
    }
  };

  // Helper: Prepare player data
  const preparePlayers = () => {
    const combinedPlayers = playerGame.data.map((playG) => ({
      ...playG,
      ...playerSeason.data.find((playS) => playS.playerId === playG.playerId),
    }));

    allPlayers.current = combinedPlayers;

    activeGamePlayers.current = combinedPlayers
      .filter((player) => {
        const { gameStatus } = player;
        return ['dressed', 'starter', 'gkStarter'].includes(gameStatus);
      })
      .map((player) => {
        const playerSubs = {
          ins: subs.filter(
            (sub) => sub.subIn === player.playerId && sub.gameMinute
          ).length,
          outs: subs.filter(
            (sub) => sub.subOut === player.playerId && sub.gameMinute
          ).length,
        };

        const subStatus =
          (player.gameStatus === 'starter' ||
            player.gameStatus === 'gkStarter') +
          playerSubs.ins -
          playerSubs.outs;

        const times = {
          inMinutes: subs
            .filter((sub) => sub.subIn === player.playerId)
            .reduce((acc, sub) => acc + sub.gameMinute, 0),
          outMinutes: subs
            .filter((sub) => sub.subOut === player.playerId)
            .reduce((acc, sub) => acc + sub.gameMinute, 0),
        };

        return {
          ...player,
          ...playerSubs,
          subStatus,
          subIns: subs.filter((sub) => sub.subIn === player.playerId),
          subOuts: subs.filter((sub) => sub.subOut === player.playerId),
          ...times,
          lastIn: Math.max(...(times.inMinutes || [0])),
          lastOut: Math.max(...(times.outMinutes || [0])),
          minPlayed:
            gameStatus !== 'to be played'
              ? subStatus === 1
                ? converthmsToSecondsOnly(game.actualgametime) || 0
                : times.outMinutes - times.inMinutes
              : 0,
        };
      });

    setCurrentPlayers({
      onField: activeGamePlayers.current
        .filter((player) => player.subStatus === 1)
        .sort((a, b) => a.number - b.number),
      offField: activeGamePlayers.current
        .filter((player) => player.subStatus === 0)
        .sort((a, b) => a.number - b.number),
      subsInWaiting: [
        ...subs.filter((sub) => !sub.gameMinute),
        { id: null, subIn: null, subOut: null },
      ],
    });
  };

  useEffect(() => {
    if (isLoading) return;

    handleMissingPlayers();
    preparePlayers();
  }, [isLoading, playerGame.data, playerSeason.data, subs, gameStatus]);

  if (isLoading || missingPlayers.current || isCreating || isUpdating) {
    return <Spinner />;
  }

  return (
    <PlayerContext.Provider
      value={{
        currentPlayers,
        setCurrentPlayers,
        activeGamePlayers,
        subsInWaiting,
        setSubsInWaiting,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

function usePlayerContext() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error(
      'usePlayerContext must be used within a PlayerContextProvider'
    );
  }
  return context;
}

export { PlayerContextProvider, usePlayerContext };
