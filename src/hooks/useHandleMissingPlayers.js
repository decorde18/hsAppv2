import { useState, useEffect } from 'react';

export function useHandleMissingPlayers(
  playerSeason,
  playerGame,
  gameId,
  createData
) {
  const [missingPlayers, setMissingPlayers] = useState(null);

  useEffect(() => {
    const missing = playerSeason
      .filter(
        (playerS) =>
          !playerGame.some((playerG) => playerG.playerid === playerS.playerId)
      )
      .map((playerS) => ({
        player: playerS.playerId,
        game: gameId,
        status: playerS.teamLevel.includes('Varsity')
          ? 'dressed'
          : 'notDressed',
      }));

    if (missing.length > 0) {
      setMissingPlayers(missing);
      createData(
        { table: 'playerGames', newData: missing, toast: false },
        { onSuccess: () => setMissingPlayers(null) }
      );
    }
  }, [playerSeason, playerGame, gameId, createData]);

  return missingPlayers;
}
