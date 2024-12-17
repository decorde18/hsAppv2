import { useState, useEffect } from 'react';
import { useData } from '../services/useUniversal';

function useGameData(gameId) {
  const [seasonId, setSeasonId] = useState(null);

  // Fetch game data
  const gameResponse = useData({
    table: 'games',
    filter: [{ field: 'id', value: gameId }],
  });

  // Update seasonId when game data is available
  useEffect(() => {
    if (gameResponse.data && gameResponse.data[0]) {
      setSeasonId(gameResponse.data[0].seasonId);
    }
  }, [gameResponse.data]);

  // Fetch other datasets
  const periodsResponse = useData({
    table: 'periods',
    filter: [{ field: 'game', value: gameId }],
  });

  const minorEventsResponse = useData({
    table: 'minorEvents',
    filter: [{ field: 'game', value: gameId }],
  });

  const stoppagesResponse = useData({
    table: 'stoppages',
    filter: [{ field: 'game', value: gameId }],
  });

  const subTotalsResponse = useData({
    table: 'subs',
    filter: [{ field: 'game', value: gameId }],
  });

  const subsResponse = useData({
    table: 'sub',
    filter: [{ field: 'game', value: gameId }],
  });

  const playerGameResponse = useData({
    table: 'playerGames',
    filter: [{ field: 'game', value: gameId }],
  });

  // Conditionally fetch playerSeason data
  const playerSeasonResponse = useData(
    seasonId
      ? {
          table: 'playerSeasons',
          filter: [
            { field: 'status', value: 'Rostered' },
            { field: 'seasonId', value: seasonId },
          ],
        }
      : { table: 'playerSeasons', filter: [] } // Pass null to skip fetching until seasonId is available
  );

  // Combine loading and error states
  const isLoading =
    gameResponse.isLoading ||
    periodsResponse.isLoading ||
    minorEventsResponse.isLoading ||
    stoppagesResponse.isLoading ||
    subTotalsResponse.isLoading ||
    subsResponse.isLoading ||
    playerGameResponse.isLoading ||
    (seasonId && playerSeasonResponse.isLoading); // Only check when seasonId is defined

  const error =
    gameResponse.error ||
    periodsResponse.error ||
    minorEventsResponse.error ||
    stoppagesResponse.error ||
    subTotalsResponse.error ||
    subsResponse.error ||
    playerGameResponse.error ||
    playerSeasonResponse?.error; // Safe access for optional playerSeasonResponse

  // Combine data into one object
  return {
    game: gameResponse.data ? gameResponse.data[0] : null,
    periods: periodsResponse.data || [],
    minorEvents: minorEventsResponse.data || [],
    stoppages: stoppagesResponse.data || [],
    subTotals: subTotalsResponse.data || [],
    subs: subsResponse.data || [],
    playerGame: playerGameResponse.data || [],
    playerSeason: playerSeasonResponse?.data || [], // Safe access for optional playerSeasonResponse
    isLoading,
    error,
  };
}

export default useGameData;
