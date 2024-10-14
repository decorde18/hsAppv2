import Spinner from '../ui/Spinner';

// import GameStatsEdit from '../features/games/gameStatsEntry/GameStatsEdit';
import {
  useCreateData,
  useData,
  useUpdateData,
} from '../services/useUniversal';
import { useEffect, useState, createContext, useContext, useRef } from 'react';

import { converthmsToSecondsOnly } from '../utils/helpers';
import { useGameContext } from './GameContext';

const PlayerContext = createContext();

function PlayerContextProvider({ children }) {
  const { gameDetails, getGameTime } = useGameContext();
  const { game, subs, subTotals } = gameDetails;
  const { isCreating, createData } = useCreateData();
  const { isUpdating, updateData } = useUpdateData();
  const allPlayers = useRef();
  const activeGamePlayers = useRef();
  const [subsInWaiting, setSubsInWaiting] = useState([
    ...subs.filter((sub) => !sub.gameMinute),
    { id: null, subIn: null, subOut: null },
  ]);

  const playerGame = useData({
    table: 'playerGame',
    filter: [{ field: 'game', value: game.id, table: 'playerGames' }],
  });
  const playerSeason = useData({
    table: 'playerSeasons',
    filter: [
      { field: 'seasonId', value: game.seasonId, table: 'playerSeason' },
      { field: 'status', value: 'Rostered', table: 'playerSeason' },
    ],
  });

  const [missingPlayers, setMissingPlayers] = useState(['loading']);

  const [currentPlayers, setCurrentPlayers] = useState();
  // let activePlayers;
  useEffect(() => {
    //update playerGames if they are missing
    if (playerGame.isLoading || playerSeason.isLoading) return;

    const missing = playerSeason.data
      .filter((playerS) =>
        playerGame.data.every((playerG) => playerG.id !== playerS.playerId)
      )
      .map((player) => ({
        player: player.playerId,
        game: game.id,
        status: playerSeason.data
          .find((playerS) => playerS.playerId === player.playerId)
          .teamLevel.includes('Varsity')
          ? 'dressed'
          : 'notDressed',
      }));

    setMissingPlayers(missing);

    if (missing.length)
      createData({
        table: 'playerGames',
        newData: missing,
        bulk: true,
        toast: false,
      });
    const playerG = playerGame.data.map((playG) => ({
      gameStatus: playG.status,
      ...playG,
    })); //convert status to gameStatus so it doesn't conflict with season Status
    allPlayers.current = playerG.map((playG) => ({
      ...playG,
      ...playerSeason.data.find((playS) => playS.playerId === playG.id),
    }));

    activeGamePlayers.current = allPlayers.current
      .filter(
        (player) =>
          player.gameStatus === 'dressed' ||
          player.gameStatus === 'starter' ||
          player.gameStatus === 'gkStarter'
      )
      .map((player) => {
        const ins = subs.filter(
          (sub) => sub.subIn === player.playerId && sub.gameMinute
        ).length;
        const outs = subs.filter(
          (sub) => sub.subOut === player.playerId && sub.gameMinute
        ).length;
        const start =
          player.gameStatus === 'starter' || player.gameStatus === 'gkStarter';
        const subStatus = start + ins - outs;
        const inMinutes = subs
          .filter((sub) => sub?.subIn === player.playerId)
          .reduce((acc, min) => acc + min.gameMinute, 0);
        const outMinutes = subs
          .filter((sub) => sub?.subOut === player.playerId)
          .reduce((acc, min) => acc + min.gameMinute, 0);
        return {
          ...player,
          ins,
          outs,
          subStatus,
          subIns: subs.filter((sub) => sub?.subIn === player.playerId),
          subOuts: subs.filter((sub) => sub?.subOut === player.playerId),
          inMinutes,
          outMinutes,
          lastIn:
            subs
              .filter((sub) => sub?.subIn === player.playerId)
              .sort((a, b) => b.gameMinute - a.gameMinute)[0]?.gameMinute || 0,
          lastOut:
            subs
              .filter((sub) => sub?.subOut === player.playerId)
              .sort((a, b) => b.gameMinute - a.gameMinute)[0]?.gameMinute || 0,
          minPlayed:
            game.status !== 'to be played'
              ? subStatus === 1
                ? converthmsToSecondsOnly(game.actualgametime) || 0
                : 0 + outMinutes - inMinutes
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
  }, [
    createData,
    game,
    subs,
    playerGame.data,
    playerGame.isLoading,
    playerSeason.data,
    playerSeason.isLoading,
  ]);
  function updateCurrentPlayers({ subIn, subOut }, gameTime) {
    //create a function for entering a sub
    //1change their onField or offField Status
    //2change substatus to either 0 or 1
    //3change either ins or outs to increase by one
    const [subbedOut] = currentPlayers.onField
      .filter((player) => player.playerId === subOut)
      .map((player) => ({
        ...player,
        subStatus: 0,
        outs: player.outs + 1,
        outMinutes: player.outMinutes + gameTime,
        minPlayed: gameTime - (player.outMinutes - player.inMinutes),
        lastOut: gameTime,
        subOuts: [...player.subOuts, gameTime],
      }));
    const [subbedIn] = currentPlayers.offField
      .filter((player) => player.playerId === subIn)
      .map((player) => ({
        ...player,
        subStatus: 1,
        ins: player.ins + 1,
        inMinutes: player.inMinutes - gameTime,
        minPlayed: player.outMinutes - player.inMinutes,
        lastIn: gameTime,
        subIns: [...player.subIns, gameTime],
      }));

    setCurrentPlayers((cur) => ({
      offField: [
        ...cur.offField.filter((player) => player.playerId !== subIn),
        subbedOut,
      ].sort((a, b) => a.number - b.number),

      onField: [
        ...cur.onField.filter((player) => player.playerId !== subOut),
        subbedIn,
      ].sort((a, b) => a.number - b.number),
    }));
  }
  function enterAllSubs(updatedPeriod) {
    if (subsInWaiting.length <= 1) return;
    const gameTime = getGameTime();
    subsInWaiting.map((sub) => {
      if (sub.subIn && sub.subOut) {
        updateCurrentPlayers(sub, gameTime);
        updateData({
          table: 'subs',
          newData: {
            gameMinute: gameTime,
            ...(updatedPeriod && { periodId: updatedPeriod }),
          },
          id: sub.id,
        });
      } else if (!sub.subIn && !sub.subOut)
        setSubsInWaiting([{ id: null, subIn: null, subOut: null }]);
      else return;
    });
  }
  if (
    playerGame.isLoading ||
    playerSeason.isLoading ||
    missingPlayers.length ||
    !activeGamePlayers.current.length ||
    isCreating ||
    isUpdating
  )
    return <Spinner />;
  const playerG = playerGame.data.map((playG) => ({
    gameStatus: playG.status,
    ...playG,
  })); //convert status to gameStatus so it doesn't conflict with season Status
  const players = playerG.map((playG) => ({
    ...playG,
    ...playerSeason.data.find((playS) => playS.playerId === playG.id),
  }));

  return (
    <PlayerContext.Provider
      value={{
        players,
        currentPlayers,
        setCurrentPlayers,
        activeGamePlayers,
        subsInWaiting,
        setSubsInWaiting,
        enterAllSubs,
        updateCurrentPlayers,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
function usePlayerContext() {
  const context = useContext(PlayerContext);
  if (context === undefined)
    throw new Error('PlayerContext was used outside of PlayerContextProvider');

  return context;
}
export { PlayerContextProvider, usePlayerContext };
