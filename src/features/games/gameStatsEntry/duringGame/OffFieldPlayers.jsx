import Table from '../../../../ui/Table';
import PlayerTableRow from '../PlayerTableRow';
import { duringGameColumns } from '../gameTableColumns';

const columns = duringGameColumns;
const type = 'offField';
const columnWidths = columns
  .filter((column) => column.displaySheet.includes(type))
  .reduce((acc, cur) => {
    return (acc = acc.concat(' ', cur.width));
  }, '');

function OffFieldPlayers({ players }) {
  return (
    <Table columns={columnWidths}>
      <Table.Header>
        {columns
          .filter((column) => column.displaySheet.includes(type))
          .map((column) => (
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
            status={'during'}
            type={type}
          />
        )}
      />
    </Table>
  );
}

export default OffFieldPlayers;
