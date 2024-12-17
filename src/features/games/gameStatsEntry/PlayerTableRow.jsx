import { convertSecondsToMinutesSeconds } from '../../../utils/helpers';

import Table from '../../../ui/Table';
import { useClockContext } from '../../../contexts/ClockContext';

function PlayerTableRow({ player, displayTable, columns }) {
  const { currentPeriodTime } = useClockContext();

  //TODO on half change, last in/out need to reflect previous in/out from previous half
  //TODO at end of game, final minutes needs to be calculated differently a starter will not have the full time they were in and a sub will have more time. see game 7

  function getField(column) {
    let field = player[column.field];
    //do we need to get the value of the field
    if (column.field === 'lastOut')
      field = player.outs > 0 ? currentPeriodTime - player.lastOut : null;
    if (column.field === 'lastIn')
      field = player.ins > 0 ? currentPeriodTime - player.lastIn : null;
    //is the field min played and player on field
    if (
      (displayTable === 'onField' || displayTable === 'played') &&
      column.field === 'minPlayed'
    )
      //field = player.minPlayed + (lastIn || gameTime);
      field =
        player.outMinutes -
        player.inMinutes +
        (player.subStatus === 1
          ? player.lastIn + (currentPeriodTime - player.lastIn)
          : 0);

    // do we need to get the time for the field
    if (field && column.type === 'time')
      field = convertSecondsToMinutesSeconds(field);
    //add X if saking for start
    if (column.type === 'ex') field = field ? 'X' : '';
    if (column.field === 'playergamestatus')
      field =
        player.playergamestatus === 'starter'
          ? 'X'
          : player.playergamestatus === 'gkStarter'
          ? 'GK'
          : '';

    if (!field) field = '';
    if (field === 'subStatus') console.log(field);
    return field;
  }
  return (
    <Table.Row>
      {columns.map((column) => (
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
