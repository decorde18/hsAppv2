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
}) {
  const [players, setPlayers] = useState([]);
  const [inactivePlayers, setInactivePlayers] = useState([]);
  const [currentPlayers, setCurrentPlayers] = useState({
    onField: [],
    offField: [],
  });

  useEffect(() => {
    if (!playerGame.length || !playerSeason.length) return;

    const preparedPlayers = preparePlayerData({ playerGame, subs, gameTime });

    setPlayers(playerGame);
    setInactivePlayers(preparedPlayers.inactiveGamePlayers);
    setCurrentPlayers(
      getCurrentPlayers(preparedPlayers.activePlayersWithStats, subs)
    );
  }, [playerGame, subs, playerSeason, gameTime]);

  return { players, inactivePlayers, currentPlayers, setCurrentPlayers };
}
