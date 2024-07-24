import { useEffect, useState } from 'react';
import { useGameContext } from '../../../contexts/GameContext';

import { convertSecondsToMinutesSeconds } from '../../../utils/helpers';

import Table from '../../../ui/Table';

import { afterGameColumns, duringGameColumns } from './gameTableColumns';

function PlayerTableRow({ player, status, type }) {
  const { getGameTime } = useGameContext();
  const columns = status === 'after' ? afterGameColumns : duringGameColumns;

  const [lastOut, setLastOut] = useState();
  const [lastIn, setLastIn] = useState();

  const [gameTime, setGameTime] = useState();
  useEffect(() => {
    setInterval(() => {
      const gt = getGameTime();
      setGameTime(() => gt);
      if (player.lastIn) setLastIn(gt - player.lastIn);
      if (player.lastOut) setLastOut(gt - player.lastOut);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  function getField(column) {
    let field = player[column.field];
    //do we need to get the value of the field
    if (column.field === 'lastOut') field = lastOut;
    if (column.field === 'lastIn') field = lastIn;
    //is the field min played and player on field
    if (type === 'onField' && column.field === 'minPlayed')
      field = player.minPlayed + (lastIn || gameTime);

    // do we need to get the time for the field
    if (field && column.type === 'time')
      field = convertSecondsToMinutesSeconds(field);

    //add X if saking for start
    if (column.field === 'gameStatus')
      field =
        player.gameStatus === 'starter'
          ? 'X'
          : player.gameStatus === 'gkStarter'
          ? 'GK'
          : '';

    if (!field) field = '';

    return field;
  }
  return (
    <Table.Row>
      {columns
        .filter((column) => column.displaySheet.includes(type))
        .map((column) => (
          <div
            style={{
              textAlign: column.textAlign,
              fontFamily: 'Space Mono',
            }}
            key={column.field}
          >
            {getField(column)}
          </div>
        ))}
    </Table.Row>
  );
}

export default PlayerTableRow;
