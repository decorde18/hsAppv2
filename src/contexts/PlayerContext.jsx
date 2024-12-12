import { useEffect, useState, createContext, useContext, useRef } from 'react';
import { useGameContext } from './GameContext';
import { useCreateData, useUpdateData } from '../services/useUniversal';
import { converthmsToSecondsOnly } from '../utils/helpers';
import Spinner from '../ui/Spinner';
import {
  getCurrentPlayers,
  handleMissingPlayers,
  preparePlayerData,
} from '../features/games/gameStatsEntry/gameStatsEntryHelperFunctions';

const PlayerContext = createContext();

function PlayerContextProvider({ playerDetails, gameDetails, children }) {
  const { playerGame, playerSeason } = playerDetails;
  const { game, subs, subTotals } = gameDetails;

  const { gameData, getGameTime } = useGameContext();
  const { gameStatus } = gameData;

  const { isCreating, createData } = useCreateData();
  const { isUpdating, updateData } = useUpdateData();

  const allPlayers = useRef();
  const activeGamePlayers = useRef([]);
  // const missingPlayers = useRef(false);

  const [players, setPlayers] = useState([]);
  const [inactivePlayers, setInactivePlayers] = useState([]);
  const [currentPlayers, setCurrentPlayers] = useState({
    onField: [],
    offField: [],
    subsInWaiting: [],
  });
  const [missingPlayers, setMissingPlayers] = useState(playerGame);

  const [subsInWaiting, setSubsInWaiting] = useState([
    ...subs.filter((sub) => !sub.gameMinute),
    { id: null, subIn: null, subOut: null },
  ]);
  // const [currentPlayers, setCurrentPlayers] = useState();

  useEffect(() => {
    // Handle missing players - This function is now separated for clarity
    const missing = handleMissingPlayers(playerSeason, playerGame, game.id);
    setMissingPlayers(missing);
    if (missing.length > 0) {
      // console.log(missing);
      createData(
        {
          table: 'playerGames',
          newData: missing,
          bulk: true,
          toast: false,
        },
        {
          onSuccess: () => setMissingPlayers(false),
        }
      );
    }
  }, [createData, game.id, playerGame, playerSeason]);

  useEffect(() => {
    if (missingPlayers) return;
    const preparedPlayers = preparePlayerData(
      playerGame,
      playerSeason,
      subs,
      game.actualgametime
    );
    setPlayers(preparedPlayers.allPlayers);
    setInactivePlayers(preparedPlayers.inactiveGamePlayers);
    setCurrentPlayers(
      getCurrentPlayers(preparedPlayers.activePlayersWithStats, subs)
    );
  }, [
    game.actualgametime,
    gameStatus,
    playerGame,
    playerSeason,
    subs,
    missingPlayers,
  ]);

  // useEffect(() => {
  //   // Check for missing players
  //   const missing = playerSeason
  //     .filter((playerS) =>
  //       playerGame.every((playerG) => playerG.playerid !== playerS.playerId)
  //     )
  //     .map((playerS) => ({
  //       player: playerS.playerId,
  //       game: game.id,
  //       status: playerS.teamLevel.includes('Varsity')
  //         ? 'dressed'
  //         : 'notDressed',
  //     }));

  //   // If missing players exist, create them in `playerGames`
  //   if (missing.length > 0) {
  //     missingPlayers.current = missing;
  //     createData(
  //       {
  //         table: 'playerGames',
  //         newData: missing,
  //         bulk: true,
  //         toast: false,
  //       },
  //       {
  //         onSuccess: () => {
  //           missingPlayers.current = false; // Reset the state after successful creation
  //         },
  //       }
  //     );
  //   } else {
  //     missingPlayers.current = false;
  //   }
  // }, [createData, game.id, playerGame, playerSeason]);

  if (missingPlayers || isCreating || isUpdating) return <Spinner />;

  // if (
  //   missingPlayers.current ||
  //   !activeGamePlayers.current?.length ||
  //   isCreating ||
  //   isUpdating
  // )
  //   return <Spinner />;

  // const players = playerGame.map(({ playergamestatus, ...rest }) => ({
  //   playergamestatus: playergamestatus, // Rename "status" to "gameStatus"
  //   ...rest,
  //   ...playerSeason.find((playS) => playS.playerId === rest.id), // Merge matching playerSeason data
  // }));

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
    const gameTime = getGameTime.gameTime();
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
  return (
    <PlayerContext.Provider
      value={{ players, currentPlayers, updateCurrentPlayers, enterAllSubs }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
//   return (
//     <PlayerContext.Provider
//       value={{
//         players,
//         currentPlayers,
//         setCurrentPlayers,
//         activeGamePlayers,
//         subsInWaiting,
//         setSubsInWaiting,
//         enterAllSubs,
//         updateCurrentPlayers,
//       }}
//     >
//       {children}
//     </PlayerContext.Provider>
//   );
// }

function usePlayerContext() {
  const context = useContext(PlayerContext);
  if (context === undefined)
    throw new Error('PlayerContext must be used within PlayerContextProvider');
  return context;
}

export { PlayerContextProvider, usePlayerContext };
// useEffect(() => {
//   if (playerGame.isLoading || playerSeason.isLoading) return;

//   // Ensure missing players have been handled
//   if (missingPlayers.current && missingPlayers.current.length > 0) return;

//   // Prepare player game data
//   const playerG = playerGame.map((playG) => ({
//     playergamestatus: playG.playergamestatus, // Convert status to gameStatus
//     ...playG,
//   }));

//   // Combine player game and season data
//   allPlayers.current = playerG.map((playG) => ({
//     ...playG,
//     ...playerSeason.find((playS) => playS.playerId === playG.id),
//   }));

//   // Filter and prepare active game players
//   activeGamePlayers.current = allPlayers.current
//     .filter(
//       (player) =>
//         player.playergamestatus === 'dressed' ||
//         player.playergamestatus === 'starter' ||
//         player.playergamestatus === 'gkStarter'
//     )
//     .map((player) => {
//       const ins = subs.filter(
//         (sub) => sub.subIn === player.playerId && sub.gameMinute
//       ).length;
//       const outs = subs.filter(
//         (sub) => sub.subOut === player.playerId && sub.gameMinute
//       ).length;
//       const start =
//         player.playergamestatus === 'starter' ||
//         player.playergamestatus === 'gkStarter';
//       const subStatus = start + ins - outs;

//       const inMinutes = subs
//         .filter((sub) => sub?.subIn === player.playerId)
//         .reduce((acc, sub) => acc + sub.gameMinute, 0);
//       const outMinutes = subs
//         .filter((sub) => sub?.subOut === player.playerId)
//         .reduce((acc, sub) => acc + sub.gameMinute, 0);

//       return {
//         ...player,
//         ins,
//         outs,
//         subStatus,
//         subIns: subs.filter((sub) => sub?.subIn === player.playerId),
//         subOuts: subs.filter((sub) => sub?.subOut === player.playerId),
//         inMinutes,
//         outMinutes,
//         lastIn:
//           subs
//             .filter((sub) => sub?.subIn === player.playerId)
//             .sort((a, b) => b.gameMinute - a.gameMinute)[0]?.gameMinute || 0,
//         lastOut:
//           subs
//             .filter((sub) => sub?.subOut === player.playerId)
//             .sort((a, b) => b.gameMinute - a.gameMinute)[0]?.gameMinute || 0,
//         minPlayed:
//           gameStatus !== 'to be played'
//             ? subStatus === 1
//               ? converthmsToSecondsOnly(game.actualgametime) || 0
//               : outMinutes - inMinutes
//             : 0,
//       };
//     });

//   // Update the current players' state
//   setCurrentPlayers({
//     onField: activeGamePlayers.current
//       .filter((player) => player.subStatus === 1)
//       .sort((a, b) => a.number - b.number),
//     offField: activeGamePlayers.current
//       .filter((player) => player.subStatus === 0)
//       .sort((a, b) => a.number - b.number),
//     subsInWaiting: [
//       ...subs.filter((sub) => !sub.gameMinute),
//       { id: null, subIn: null, subOut: null },
//     ],
//   });
// }, [
//   playerGame,
//   playerSeason,
//   subs,
//   gameStatus,
//   game.actualgametime,
//   playerGame.isLoading,
//   playerSeason.isLoading,
// ]);

// const players = playerGame.map(({ playergamestatus, ...rest }) => ({
//   playergamestatus, // Rename "status" to "gameStatus"
//   ...rest,
//   ...playerSeason.find((playS) => playS.playerId === rest.id), // Merge matching playerSeason data
// }));

// function enterAllSubs(updatedPeriod) {
//   if (subsInWaiting.length <= 1) return;
//   const gameTime = getGameTime.gameTime();
//   subsInWaiting.forEach((sub) => {
//     if (sub.subIn && sub.subOut) {
//       updateCurrentPlayers(sub, gameTime);
//       updateData({
//         table: 'subs',
//         newData: {
//           gameMinute: gameTime,
//           ...(updatedPeriod && { periodId: updatedPeriod }),
//         },
//         id: sub.id,
//       });
//     } else if (!sub.subIn && !sub.subOut) {
//       setSubsInWaiting([{ id: null, subIn: null, subOut: null }]);
//     }
//   });
// }
// function updateCurrentPlayers({ subIn, subOut }, gameTime) {
//   // Create a function for entering a sub
//   // 1. Change their onField or offField status
//   // 2. Change subStatus to either 0 or 1
//   // 3. Increment ins or outs

//   const [subbedOut] = currentPlayers.onField
//     .filter((player) => player.playerId === subOut)
//     .map((player) => ({
//       ...player,
//       subStatus: 0,
//       outs: player.outs + 1,
//       outMinutes: player.outMinutes + gameTime,
//       minPlayed: gameTime - (player.outMinutes - player.inMinutes),
//       lastOut: gameTime,
//       subOuts: [...player.subOuts, gameTime],
//     }));

//   const [subbedIn] = currentPlayers.offField
//     .filter((player) => player.playerId === subIn)
//     .map((player) => ({
//       ...player,
//       subStatus: 1,
//       ins: player.ins + 1,
//       inMinutes: player.inMinutes - gameTime,
//       minPlayed: player.outMinutes - player.inMinutes,
//       lastIn: gameTime,
//       subIns: [...player.subIns, gameTime],
//     }));

//   setCurrentPlayers((cur) => ({
//     offField: [
//       ...cur.offField.filter((player) => player.playerId !== subIn),
//       subbedOut,
//     ].sort((a, b) => a.number - b.number),

//     onField: [
//       ...cur.onField.filter((player) => player.playerId !== subOut),
//       subbedIn,
//     ].sort((a, b) => a.number - b.number),
//   }));
// }

//   function updateCurrentPlayers({ subIn, subOut }, gameTime) {
//     const updatedPlayers = updatePlayerStatus(
//       currentPlayers,
//       subIn,
//       subOut,
//       gameTime
//     );
//     setCurrentPlayers(updatedPlayers);

//     updateData({
//       table: 'subs',
//       newData: { gameMinute: gameTime, periodId: currentPlayers.periodId }, // Assuming periodId is in context
//       id: currentPlayers.subId,
//     });
//   }

//   function enterAllSubs(updatedPeriod) {
//     const gameTime = getGameTime();
//     const newSubs = currentPlayers.subsInWaiting.map((sub) => {
//       if (sub.subIn && sub.subOut) {
//         updateCurrentPlayers(sub, gameTime);
//         return { ...sub, gameMinute: gameTime, periodId: updatedPeriod }; //Modify only necessary fields
//       }
//       return sub;
//     });

//     setCurrentPlayers((prev) => ({ ...prev, subsInWaiting: newSubs })); //Efficient update

//     // Bulk update for all subs instead of individual updates
//     updateData({
//       table: 'subs',
//       newData: newSubs.filter((sub) => sub.gameMinute), //only subs that were updated
//       bulk: true,
//     });
//   }

// //Helper Functions
