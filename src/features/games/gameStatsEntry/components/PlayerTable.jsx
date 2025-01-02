import { usePlayerContext } from '../../../../contexts/PlayerContext';
import Table from '../../../../ui/Table';
import {
  afterGameColumns,
  duringGameColumns,
  periodBreakColumns,
} from '../gameTableColumns';

import PlayerTableRow from '../PlayerTableRow';

function PlayerTable({ status, displayTable = 'all', sortArr }) {
  const { currentPlayers } = usePlayerContext();
  const availablePlayers = {
    onField: currentPlayers.onField,
    offField: currentPlayers.offField,
    all: [...currentPlayers.onField, ...currentPlayers.offField],
    DNP: filterPlayers(
      [...currentPlayers.onField, ...currentPlayers.offField],
      'DNP'
    ),
    played: filterPlayers(
      [...currentPlayers.onField, ...currentPlayers.offField],
      'played'
    ),
  };
  const activePlayers = availablePlayers[displayTable];

  const columnsMap = {
    after: afterGameColumns,
    break: periodBreakColumns,
    default: duringGameColumns,
  };

  const columns = (columnsMap[status] || columnsMap.default).filter((column) =>
    column.displayTable.includes(displayTable)
  );

  const columnWidths = columns.map((column) => column.width).join(' ');

  // Filter and sort the players
  const filteredPlayers = filterPlayers(activePlayers, displayTable);
  const players = dynamicSort(filteredPlayers, sortArr);

  function filterPlayers(players, displayTable) {
    players, displayTable;
    switch (displayTable) {
      case 'played':
        return players.filter(
          (player) =>
            player.ins > 0 ||
            player.playergamestatus === 'starter' ||
            player.playergamestatus === 'gkStarter'
        );
      case 'DNP':
        return players.filter(
          (player) =>
            player.ins === 0 &&
            player.playergamestatus !== 'starter' &&
            player.playergamestatus !== 'gkStarter'
        );
      default:
        return players; // Assuming activeGamePlayers is passed as players in the default case
    }
  }
  function dynamicSort(sortArray, sortFields) {
    return sortFields.reduce(
      (acc, each) =>
        acc.sort((a, b) =>
          each.order === 'dec'
            ? b[each.field] - a[each.field]
            : a[each.field] - b[each.field]
        ),
      sortArray
    );
  }

  return (
    <Table columns={columnWidths}>
      <Table.Header>
        {columns.map((column) => (
          <div
            key={column.field}
            style={{
              textAlign: column.textAlign,
            }}
          >
            {column.label}
          </div>
        ))}
      </Table.Header>

      <Table.Body
        data={players}
        render={(player) => (
          <PlayerTableRow
            player={player}
            key={player.id}
            status={status}
            displayTable={displayTable}
            columns={columns}
          />
        )}
      />
    </Table>
  );
}

export default PlayerTable;
