import {
  useData,
  useCreateData,
  useUpdateData,
} from '../services/useUniversal';

import { getCurrentTime, subtractTime } from '../utils/helpers';

const { isCreating, createData } = useCreateData();
const { isUpdating, updateData } = useUpdateData();

const [noOfPeriods, setNoOfPeriods] = useState(2);

const [gameData, setGameData] = useState();
const [minorEventCategories, setMinorEventCategories] = useState(meCategories);

useEffect(
  () => {
    if (isWorking) return;
    const { current, status, progress, maxPeriods } = getGameStatus();

    setNoOfPeriods(maxPeriods);
    const periodStatus =
      current?.period === 'so'
        ? 'shootout'
        : current?.period > gd.game.reg_periods + gd.game.min_ot_periods
        ? 'ot2'
        : current?.period > gd.game.reg_periods
        ? 'ot1'
        : 'regulation';
    setGd2({
      currentPeriod: current,
      periodStatus,
      gameStatus: status,
      gameProgress: progress,
      stoppageStatus: stoppages.data.find((stoppage) => !stoppage.end) || false,
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [game.data, gd.periods, stoppages.data, isWorking]
);

function getGameTime() {
  const gameTime = {
    gameStart: '',
    currentPeriodStart: '',
    currentPeriodTime: '',
  };
  //TODO gametime and elapsedgamtime/truegamtime/modifiedgametime, somehting, need to be adjusted to include clockStopped
  /* the gametime is only for saving the minute entered for start, end, subin/out */
  const elapsedGameTime =
    periods.data
      .filter((period) => period.end && period.start)
      .reduce((acc, period) => {
        return (acc = acc + subtractTime(period.start, period.end));
      }, 0) +
    (gameData.currentPeriod?.start && !gameData.currentPeriod.end
      ? subtractTime(gameData.currentPeriod.start, getCurrentTime())
      : 0);
  const stoppedTime = stoppages.data
    .filter((stoppage) => stoppage.clockStopped)
    .reduce((acc, min) => (acc = acc + min.end - min.begin), 0);
  const officialGameTime = elapsedGameTime - stoppedTime;
  return { elapsedGameTime, officialGameTime, gameTime };
}

const getGameTimes = {
  //actual time, gameStoppedTime, periodStoppedTime
  actualTime: () =>
    console.log(
      'This is for the begin/end of periods, sub times, stoppage times, etc'
    ),
};
const periodHandle = {
  //create periods, end periods, update period, delete period
  createPeriod,
};
function createPeriod(noStart) {
  !noStart && setGd2((prev) => ({ ...prev, gameProgress: 'periodActive' }));
  const start = noStart ? null : getCurrentTime();
  const { game } = gd;

  const period = gd2.currentPeriod?.period + 1 || 1;

  const defaultTime =
    gd2.periodStatus === 'ot1'
      ? game.ot_1_minutes
      : gd2.periodStatus === 'ot2'
      ? game.ot_2_minutes
      : gd2.periodStatus === 'shootout'
      ? null
      : game.reg_periods_minutes;
}

function endPeriod() {
  // todo on end period function, we need to determine if we need another period (reg, ot, so)
}

if (isWorking || !gameData?.game.id) return <Spinner />;
