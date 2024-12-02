import { NavLink } from 'react-router-dom';
import Row from '../../../ui/Row';
import Button from '../../../ui/Button';

import Table from '../../../ui/Table';
import PlayerTableRow from './PlayerTableRow';
import { afterGameColumns } from './gameTableColumns';

import { useGameContext } from '../../../contexts/GameContext';
import { usePlayerContext } from '../../../contexts/PlayerContext';
import ModalGamesEditButton from './modalGamesEdit/ModalGamesEditButton';
import PlayerTable from './components/PlayerTable';

const columns = afterGameColumns;
// const columnWidths = columns.reduce((acc, cur) => {
//   return (acc = acc.concat(' ', cur.width));
// }, '');

function GameAfter({ editGame, isWorking }) {
  const { gameDataArrays } = useGameContext();
  const { game } = gameDataArrays;
  const { activeGamePlayers } = usePlayerContext();
  const activePlayers = activeGamePlayers.current;

  //TODO use PlayerTable - currently it is used for GamePeriodBreak
  return (
    <div>
      <Row type="horizontal" justify="center">
        <ModalGamesEditButton />
      </Row>
      DID NOT PLAY
      <PlayerTable
        displayTable={'DNP'}
        status={'after'}
        sortArr={[
          { field: 'number', order: 'asc' },
          { field: 'minPlayed', order: 'dec' },
        ]}
      />
      PLAYED
      <PlayerTable
        displayTable={'played'}
        status={'after'}
        sortArr={[
          { field: 'number', order: 'asc' },
          { field: 'minPlayed', order: 'dec' },
        ]}
      />
      {/* <Table columns={columnWidths}>
        <Table.Header>
          {columns
            .filter((column) => column.displayTable.includes('played'))
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
            .filter((column) => column.displayTable.includes('DNP'))
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
      </Table> */}
    </div>
  );
}

export default GameAfter;
