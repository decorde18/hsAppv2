import { useState, useEffect } from 'react';
import {
  getCurrentPlayers,
  preparePlayerData,
} from '../features/games/gameStatsEntry/helpers/gameStatsEntryHelperFunctions';

export function usePreparePlayerData({
  playerGame,
  playerSeason,
  subs,
  gameTime,
  stoppages,
  stoppageHandle,
}) {
  const [players, setPlayers] = useState([]);
  const [inactivePlayers, setInactivePlayers] = useState([]);
  const [currentPlayers, setCurrentPlayers] = useState({
    onField: [],
    offField: [],
  });

  useEffect(() => {
    if (!playerGame.length || !playerSeason.length) return;

    const { activePlayers, inactiveGamePlayers } = preparePlayerData({
      playerGame,
      subs,
      gameTime,
      stoppages,
      stoppageHandle,
    });

    setPlayers(activePlayers);
    setInactivePlayers(inactiveGamePlayers);
    setCurrentPlayers(getCurrentPlayers(activePlayers));
  }, [playerGame, playerSeason, subs, gameTime, stoppages, stoppageHandle]);

  return { players, inactivePlayers, currentPlayers, setCurrentPlayers };
}
