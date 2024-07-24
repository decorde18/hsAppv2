import { useSearchParams } from 'react-router-dom';

import Spinner from '../ui/Spinner';

import GameHeader from '../features/games/gameStatsEntry/GameHeader';
import GameSettings from '../features/games/gameStatsEntry/GameSettings';
import { GameProgress } from '../features/games/gameStatsEntry/GameProgress';

// import GameStatsEdit from '../features/games/gameStatsEntry/GameStatsEdit';
import {
  useCreateData,
  useData,
  useUpdateData,
} from '../services/useUniversal';
import { useEffect, useState, createContext, useContext } from 'react';

import styled from 'styled-components';
import {
  converthmsToSecondsOnly,
  getCurrentTime,
  subtractTime,
} from '../utils/helpers';
import { useGameContext } from './GameContext';

const PlayerContext = createContext();

function PlayerContextProvider({ children }) {
  const { game, subs, subTotals } = useGameContext();
  const { isCreating, createData } = useCreateData();
  const { isUpdating, updateData } = useUpdateData();

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

  const [missingPlayers, setMissingPlayers] = useState([]);

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
      });
  }, [
    createData,
    game.id,
    playerGame.data,
    playerGame.isLoading,
    playerSeason.data,
    playerSeason.isLoading,
  ]);
  if (
    playerGame.isLoading ||
    playerSeason.isLoading ||
    missingPlayers.length ||
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
  const activePlayers = players
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
            .sort((a, b) => b.subIn - a.subIn)[0]?.gameMinute || 0,
        lastOut:
          subs
            .filter((sub) => sub?.subOut === player.playerId)
            .sort((a, b) => b.subOut - a.subOut)[0]?.gameMinute || 0,
        minPlayed:
          game.status !== 'to be played'
            ? subStatus === 1
              ? converthmsToSecondsOnly(game.actualgametime) || 0
              : 0 + outMinutes - inMinutes
            : 0,
      };
    });


  return (
    <PlayerContext.Provider value={activePlayers}>
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
