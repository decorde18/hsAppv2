import { pl } from 'date-fns/locale';
import {
  converthmsToSecondsOnly,
  convertSecondsToMinutesSeconds,
} from '../../../../utils/helpers';
import { min } from 'date-fns';

export const meCategories = {
  for: { foul: [], corner: [], offside: [], shots: [] },
  against: { foul: [], corner: [], offside: [], shots: [] },
};
export const buttons = [
  { id: 1, type: 'foul', section: 'for' },
  { id: 2, type: 'offside', section: 'for' },
  { id: 3, type: 'corner', section: 'for' },
  { id: 4, type: 'shots', section: 'for' },
  { id: 5, type: 'foul', section: 'against' },
  { id: 6, type: 'offside', section: 'against' },
  { id: 7, type: 'corner', section: 'against' },
  { id: 8, type: 'shots', section: 'against' },
  { id: 9, type: 'goal', section: 'stoppage' },
  { id: 10, type: 'discipline', section: 'stoppage' },
  { id: 11, type: 'injury', section: 'stoppage' },
  { id: 12, type: 'other', section: 'stoppage' },
];

export function getStatuses({ game, periods, stoppages }) {
  if (!game || !periods || !stoppages) {
    throw new Error('Invalid input: Missing game, periods, or stoppages.');
  }

  const GAME_STATUSES = {
    TO_BE_PLAYED: 'to be played',
    IN_PROGRESS: 'in progress',
    PENDING: 'pending',
    COMPLETED: 'completed',
  };
  const GAME_PROGRESS = {
    BEFORE_GAME: 'beforeGame',
    BETWEEN_PERIODS: 'betweenPeriods',
    PERIOD_ACTIVE: 'periodActive',
    END_GAME: 'endGame',
  };

  let newPeriodNeeded = null;
  const SECONDS_IN_MINUTE = 60;

  const stoppageStatus = stoppages.find((stoppage) => !stoppage.end) || false;
  const currentPeriod =
    periods.length > 0 ? periods.sort((a, b) => b.period - a.period)[0] : false;

  //game hasn't started
  if (!currentPeriod) {
    return {
      gameStatus: GAME_STATUSES.TO_BE_PLAYED,
      gameProgress: GAME_PROGRESS.BEFORE_GAME,
      currentPeriod: null,
      stoppageStatus,
      newPeriodNeeded: false,
    };
  }
  //hasn't reached last period, so in between, but a period was created because the game isn't over
  if (!currentPeriod.start) {
    return {
      gameStatus: GAME_STATUSES.IN_PROGRESS,
      gameProgress: GAME_PROGRESS.BETWEEN_PERIODS,
      currentPeriod,
      stoppageStatus,
      newPeriodNeeded: false,
    };
  }
  //period hasn't ended
  if (!currentPeriod.end) {
    return {
      gameStatus: GAME_STATUSES.IN_PROGRESS,
      gameProgress: GAME_PROGRESS.PERIOD_ACTIVE,
      currentPeriod,
      stoppageStatus,
      newPeriodNeeded: false,
    };
  }

  // handling if new period is necessary and periods for OT/shootout
  const period = currentPeriod.period;

  const {
    ot_if_tied: ot,
    max_ot_periods: max,
    min_ot_periods: min,
    reg_periods: reg,
    gf,
    ga,
    so_if_tied: so,
  } = game;

  const maxPeriods = reg + (ot ? max : 0); //maxperiods this game will play
  const minPeriods = reg + (ot ? min : 0); //minperiods this game will play

  const periodType = getPeriodType();

  //game should be over

  if (periodType === 'ended') {
    return endGame();
  } else {
    return {
      gameStatus: GAME_STATUSES.PENDING,
      gameProgress: GAME_PROGRESS.BETWEEN_PERIODS,
      currentPeriod: null,
      stoppageStatus,
      newPeriodNeeded: getNewPeriodNeeded(),
    };
  }

  function getPeriodType() {
    // Regulation is still ongoing
    if (period < reg) return 'regulation';

    // Max periods reached
    if (period === maxPeriods) {
      // Shootout condition
      if (so && gf === ga) return 'shootout';
      // Game ends after max periods if no shootout or no tie
      return 'ended';
    }

    // No overtime allowed and game not tied
    if (!ot || (period === reg && gf !== ga)) return 'ended';

    // Overtime is allowed
    if (period < minPeriods) return 'ot1';
    if (period >= minPeriods && period < maxPeriods) {
      // Overtime 2 condition (still tied after ot1)
      return gf === ga ? 'ot2' : 'ended';
    }

    // Default case, should not reach here
    return 'ended';
  }
  function getNewPeriodNeeded() {
    const default_time =
      periodType === 'ot1'
        ? game.ot_1_minutes * SECONDS_IN_MINUTE //can't modify the default value of the table
        : periodType === 'ot2'
        ? game.ot_2_minutes * SECONDS_IN_MINUTE //can't modify the default value of the table
        : periodType === 'shootout'
        ? null
        : game.reg_periods_minutes;
    if (periodType === 'shootout') {
      return 'shootout';
    }
    return { default_time, period: period + 1 };
  }
  function endGame() {
    return {
      gameStatus: 'completed',
      gameProgress: 'endGame',
      currentPeriod,
      stoppageStatus,
      newPeriodNeeded,
    };
  }
}

export function preparePlayerData({ playerGame, subs, gameTime, stoppages }) {
  // Split active and inactive players
  const { activeGamePlayers, inactiveGamePlayers } = playerGame.reduce(
    (acc, player) => {
      const isActive = ['dressed', 'starter', 'gkStarter'].includes(
        player.playergamestatus
      );
      acc[isActive ? 'activeGamePlayers' : 'inactiveGamePlayers'].push(player);
      return acc;
    },
    { activeGamePlayers: [], inactiveGamePlayers: [] }
  );

  // Enrich active players with stats
  const activePlayersWithStats = activeGamePlayers.map((player) => {
    const subIns = subs.filter(
      (sub) => sub.subIn === player.playerid && sub.gameMinute
    );
    const subOuts = subs.filter(
      (sub) => sub.subOut === player.playerid && sub.gameMinute
    );

    const isStarter = ['starter', 'gkStarter'].includes(
      player.playergamestatus
    );
    const subStatus = isStarter + subIns.length - subOuts.length;

    return {
      ...player,
      subIns,
      subOuts,
      ins: subIns.length,
      outs: subOuts.length,
      subStatus,
      inMinutes: subIns.reduce((sum, sub) => sum + sub.gameMinute, 0),
      outMinutes: subOuts.reduce((sum, sub) => sum + sub.gameMinute, 0),
      lastIn: subIns.reduce((max, sub) => Math.max(max, sub.gameMinute), 0),
      lastOut: subOuts.reduce((max, sub) => Math.max(max, sub.gameMinute), 0),
    };
  });

  // Calculate players on field for each stoppage
  const playersOnFieldStoppages = calculatePlayersOnField({
    stoppages,
    activePlayersWithStats,
  });

  // Finalize active players with minPlayed and plusMinus
  const activePlayers = activePlayersWithStats.map((player) => {
    const stoppageMinutes = calculateStoppageTimeMinutesToRemove(
      playersOnFieldStoppages,
      player.playerid
    );
    const totalGameTime = converthmsToSecondsOnly(gameTime);

    const minPlayed =
      player.subStatus === 1
        ? totalGameTime - stoppageMinutes
        : player.outMinutes - player.inMinutes - stoppageMinutes;

    return {
      ...player,
      minPlayed,
      plusMinus: calculatePlusMinus(playersOnFieldStoppages, player.playerid),
    };
  });

  return { activePlayers, inactiveGamePlayers };
}

export function getCurrentPlayers(players) {
  return {
    onField: getOnFieldPlayers(players),
    offField: getOffFieldPlayers(players),
  };

  function getOnFieldPlayers(players) {
    return players
      .filter((player) => player.subStatus === 1)
      .sort((a, b) => a.number - b.number);
  }

  function getOffFieldPlayers(players) {
    return players
      .filter((player) => player.subStatus === 0)
      .sort((a, b) => a.number - b.number);
  }
}

// Calculate players on the field for each stoppage
export function calculatePlayersOnField({ stoppages, activePlayersWithStats }) {
  return stoppages.map((stoppage) => ({
    ...stoppage,
    playersOnField: activePlayersWithStats.filter((player) => {
      const isSubbedIn = player.subIns.some(
        (sub) => sub.gameMinute < stoppage.begin
      );
      const isSubbedOut = player.subOuts.some(
        (sub) => sub.gameMinute < stoppage.begin
      );
      const isStarter = player.playergamestatus.includes('starter');
      return (isSubbedIn && !isSubbedOut) || isStarter;
    }),
  }));
}
// Calculate plus-minus for a specific player
function calculatePlusMinus(stoppages, playerId) {
  return stoppages.reduce((total, stoppage) => {
    if (!stoppage.playersOnField.some((player) => player.playerid === playerId))
      return total;

    if (stoppage.event.includes('Scored')) {
      return total + 1;
    } else if (stoppage.event.includes('Against')) {
      return total - 1;
    }

    return total;
  }, 0);
}

// Calculate stoppage time to remove for a specific player
function calculateStoppageTimeMinutesToRemove(stoppages, playerId) {
  return stoppages.reduce((total, stoppage) => {
    if (!stoppage.playersOnField.some((player) => player.playerid === playerId))
      return total;

    return total + (stoppage.end - stoppage.begin) * stoppage.clockStopped;
  }, 0);
}

//ModalGameEdit Helpers
export function getPlaceholder(type) {
  switch (type) {
    case '24Time':
      return '19:00:00';
    case 'convertedSeconds':
      return '00:00';
    case 'yesNo':
      return 'true/false';
    default:
      return '';
  }
}
export function formatValue(value, inputType) {
  switch (inputType) {
    case 'convertedSeconds':
      return convertSecondsToMinutesSeconds(value);
    default:
      return value;
  }
}
