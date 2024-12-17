import { converthmsToSecondsOnly } from '../../../../utils/helpers';

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

    // let gameStatus; //to be played, completed, in progress
    // let gameProgress; //  beforeGame, periodActive, between periods, completed
    // let newPeriodNeeded = false;
    // const stoppageStatus = stoppages.find((stoppage) => !stoppage.end) || false;

    // // a current period will only be active if the game has started
    // const currentPeriod =
    //   periods.length > 0 ? periods.sort((a, b) => b.period - a.period)[0] : false;

    // if (!currentPeriod) {
    //   //game hasn't started
    //   gameProgress = 'beforeGame';
    //   gameStatus = 'to be played';
    // } else if (!currentPeriod.start) {
    //   //hasn't reached last period, so in between, but a period was created because the game isn't over
    //   gameStatus = 'in progress';
    //   gameProgress = 'betweenPeriods';
    // } else if (!currentPeriod.end) {
    //   //period hasn't ended
    //   gameStatus = 'in progress';
    //   gameProgress = 'periodActive';
    // } else {
    //   // this means we are at a break or at the end of the game
    //   //determine if it is the final period
    //   const period = currentPeriod.period;
    //   // const ot = game.ot_if_tied;
    //   // const max = game.max_ot_periods;
    //   // const min = game.min_ot_periods;
    //   // const reg = game.reg_periods;
    //   const ot = true;
    //   const max = 2;
    //   const min = 1;
    //   const reg = 2;
    //   const maxPeriods = reg + (ot ? max : 0); //maxperiods this game will play
    //   const minPeriods = reg + (ot ? min : 0); //minperiods this game will play
    //   if (period < maxPeriods) {
    //     // const gf = game.gf;
    //     const gf = 1;
    //     const ga = game.ga;
    //     const so = true;
    //     let periodType;
    //     if (period < min) periodType = 'regulation';
    //     else if (gf === ga) {
    //       //is shootout
    //       if (so && period === maxPeriods) periodType = 'shootout';
    //       else if (period >= reg && period < minPeriods) periodType = 'ot1';
    //       else if (period > reg && period < maxPeriods) periodType = 'ot2';
    //     } else if (period > reg && period < minPeriods) periodType = 'ot1';
    //     else {
    //       endGame();
    //     }
    //     if (gf !== ga) {
    //       endGame();
    //     } else {
    //       //todo this should take to end of game with endGame and completed, we got here because a period in OT ended but it was not longer tied

    //       const default_time =
    //         periodType === 'ot1'
    //           ? game.ot_1_minutes * 60 //can't modify the default value of the table
    //           : periodType === 'ot2'
    //           ? game.ot_2_minutes * 60 //can't modify the default value of the table
    //           : periodType === 'shootout'
    //           ? null
    //           : game.reg_periods_minutes;

    //       gameStatus = 'pending';
    //       gameProgress = 'betweenPeriods';
    //       newPeriodNeeded =
    //         periodType === 'shootout'
    //           ? 'shootout'
    //           : { default_time, period: period + 1 };
    //     }
    //   } else {
    //     //if it is, end the game
    //     endGame();
    //   }
    // }

    // function endGame() {
    //   gameProgress = 'endGame';
    //   gameStatus = 'completed';
    // }
    // return {
    //   gameStatus,
    //   gameProgress,
    //   currentPeriod,
    //   stoppageStatus,
    //   newPeriodNeeded,
    // };
  }
}

export function preparePlayerData({ playerGame, subs, gameTime }) {
  //  This function should handle all the mapping, filtering, and calculations.  Consider using `reduce` for more efficient aggregations.
  const { activeGamePlayers, inactiveGamePlayers } = playerGame.reduce(
    (acc, player) => {
      if (
        ['dressed', 'starter', 'gkStarter'].includes(player.playergamestatus)
      ) {
        acc.activeGamePlayers.push(player);
      } else {
        acc.inactiveGamePlayers.push(player);
      }
      return acc;
    },
    { activeGamePlayers: [], inactiveGamePlayers: [] }
  );

  const activePlayersWithStats = activeGamePlayers.map((player) => {
    const subIns = subs.filter(
      (sub) => sub.subIn === player.playerid && sub.gameMinute
    );
    const subOuts = subs.filter(
      (sub) => sub.subOut === player.playerid && sub.gameMinute
    );

    const ins = subIns.length;
    const outs = subOuts.length;
    const start = ['starter', 'gkStarter'].includes(player.playergamestatus);
    const subStatus = start + ins - outs;

    const inMinutes = subIns?.reduce((acc, min) => acc + min.gameMinute, 0);
    const outMinutes = subOuts?.reduce((acc, min) => acc + min.gameMinute, 0);

    const lastIn =
      subIns?.sort((a, b) => b.gameMinute - a.gameMinute)[0]?.gameMinute || 0;
    const lastOut =
      subOuts?.sort((a, b) => b.gameMinute - a.gameMinute)[0]?.gameMinute || 0;

    const minPlayed =
      subStatus === 1
        ? converthmsToSecondsOnly(gameTime) || 0 //todo //!fixme this needs to be fixed. it just blanket gives everyone who ended the game the minutes of the game regardless of whether they subbed in or started or how many times
        : outMinutes - inMinutes;

    return {
      ...player,
      ins,
      outs,
      subStatus,
      subIns,
      subOuts,
      inMinutes,
      outMinutes,
      lastIn,
      lastOut,
      minPlayed,
    };
  });

  return { activePlayersWithStats };
}

export function getCurrentPlayers(players, subs) {
  return {
    onField: getOnFieldPlayers(players),
    offField: getOffFieldPlayers(players),
    // subsInWaiting: getSubsInWaiting(subs),
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

  function getSubsInWaiting(subs) {
    return [
      ...subs.filter((sub) => !sub.gameMinute),
      { id: null, subIn: null, subOut: null },
    ];
  }
}

export function updatePlayerStatus(currentPlayers, subIn, subOut, gameTime) {
  // ... (Implementation for updating player statuses – less imperative)
}
