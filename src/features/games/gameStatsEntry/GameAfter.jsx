import { NavLink } from 'react-router-dom';
import Row from '../../../ui/Row';
import Button from '../../../ui/Button';

import Table from '../../../ui/Table';
import PlayerTableRow from './PlayerTableRow';
import { afterGameColumns } from './gameTableColumns';

import { useGameContext } from '../../../contexts/GameContext';
import { usePlayerContext } from '../../../contexts/PlayerContext';

const columns = afterGameColumns;
const columnWidths = columns.reduce((acc, cur) => {
  return (acc = acc.concat(' ', cur.width));
}, '');

function GameAfter({ editGame, isWorking }) {
  const { game } = useGameContext();
  const { activePlayers } = usePlayerContext();
  const playersWhoPlayed = activePlayers.filter(
    (player) =>
      player.ins > 0 ||
      player.gameStatus === 'starter' ||
      player.gameStatus === 'gkStarter'
  );
  const playersWhoDidNotPlay = activePlayers.filter(
    (player) =>
      player.ins === 0 &&
      player.gameStatus !== 'starter' &&
      player.gameStatus !== 'gkStarter'
  );
  return (
    <div>
      This is after
      <Row type="horizontal" justify="center">
        <NavLink to={`./?gameId=${game.id}&edit=true`}>
          <Button name="manualGame" disabled={isWorking} variation="secondary">
            Enter Stats Manually
          </Button>
        </NavLink>
      </Row>
      <Table columns={columnWidths}>
        <Table.Header>
          {columns
            .filter((column) => column.displaySheet.includes('played'))
            .map((column) => (
              <div
                key={column.field}
                style={{
                  textAlign: column.textAlign,
                }}
              >
                {column.label}
              </div>
              // <HeaderSortFilter
              //   key={column.field}
              //   header={{
              //     name: column.field,
              //     label: column.label,
              //     type: column.type,
              //     field: column.field,
              //     table: column.table,
              //   }}
              //   sort={{
              //     sortDirection: sort[column.table]?.find(
              //       (each) => each.field === column.field
              //     )?.direction,
              //     defaultSortDirection: column.defaultSortDirection,
              //     handleSort: handleSort,
              //   }}
              // />
            ))}
        </Table.Header>

        <Table.Body
          data={playersWhoPlayed}
          render={(player) => (
            <PlayerTableRow
              player={player}
              key={player.id}
              status={'after'}
              type={'played'}
            />
          )}
        />
      </Table>
      <div> DID NOT PLAY</div>
      <Table columns={columnWidths}>
        <Table.Header>
          {columns
            .filter((column) => column.displaySheet.includes('DNP'))
            .map((column) => (
              <div key={column.field}>{column.label}</div>
              // <HeaderSortFilter
              //   key={column.field}
              //   header={{
              //     name: column.field,
              //     label: column.label,
              //     type: column.type,
              //     field: column.field,
              //     table: column.table,
              //   }}
              //   sort={{
              //     sortDirection: sort[column.table]?.find(
              //       (each) => each.field === column.field
              //     )?.direction,
              //     defaultSortDirection: column.defaultSortDirection,
              //     handleSort: handleSort,
              //   }}
              // />
            ))}
        </Table.Header>
        <Table.Body
          data={playersWhoDidNotPlay}
          render={(player) => (
            <PlayerTableRow
              player={player}
              key={player.id}
              status={'after'}
              type={'DNP'}
            />
          )}
        />
      </Table>
    </div>
  );
}

export default GameAfter;
