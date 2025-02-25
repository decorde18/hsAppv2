import { useEffect, useState } from 'react';

import { useData } from '../../services/useUniversal';
import { filterChange, sortUpdate } from '../../utils/filterHelpers';

import Table from '../../ui/Table';
import Empty from '../../ui/Empty';
import Menus from '../../ui/Menus';
import HeaderSortFilter from '../../ui/HeaderSortFilter';
import Spinner from '../../ui/Spinner';

import PlayerRow from './PlayerRow';

const columns = [
  {
    table: 'players',
    label: 'Player',
    field: 'fullnamelast',
    type: 'string',
    sort: true,
    sortPriority: 1,
    defaultSortDirection: true,
    width: '1.5fr',
    isSearchable: true,
  },
  {
    table: 'players',
    label: 'DOB',
    field: 'dateOfBirth',
    type: 'date',
    defaultSortDirection: true,
    width: '1fr',
    isSearchable: true,
  },
  {
    table: 'players',
    label: 'Entry Year',
    field: 'entryYear',
    type: 'number',
    filter: true,
    defaultSortDirection: true,
    // defaultFilter: [2004, 2005],
    width: '.75fr',
  },
  {
    table: 'players',
    label: 'Seasons',
    field: 'seasons',
    type: 'string',
    filter: true,
    textSearch: true, //needed for finding partial values in strings
    defaultSortDirection: true,
    width: '1fr ',
  },
  { width: '0.25fr', field: 'options' },
];

function PlayerTableAllTime({ setFilteredCount }) {
  const columnWidths = columns.reduce((acc, cur) => {
    return (acc = acc.concat(' ', cur.width));
  }, '');
  const [filterOptions, setFilterOptions] = useState({});
  const [currentFilters, setCurrentFilters] = useState(
    columns
      .filter((column) => column.defaultFilter)
      .map((column) => ({
        field: column.field,
        value: column.defaultFilter,
        textSearch: column.text,
        table: column.table,
      }))
  );

  const [sort, setSort] = useState({
    [[
      ...new Set(
        columns.filter((column) => column.sort).map((column) => column.table)
      ),
    ]]: columns
      .filter((column) => column.sort)
      .map((column) => ({
        field: column.field,
        direction: column.defaultSortDirection,
        sortPriority: column.sortPriority,
      }))
      .sort((a, b) => a.sortPriority - b.sortPriority),
  }); //defaultSort Order

  const players = useData({
    table: 'players',
    filter: currentFilters.filter((option) => option.table === 'players'),
    sort: sort.players,
  });
  const seasons = useData({
    table: 'seasons',
    filter: currentFilters.filter((option) => option.table === 'seasons'),
  });

  useEffect(() => {
    if (players.isLoading || seasons.isLoading) return;
    //update filterOptions if needed
    const options = columns
      .filter((column) => column.filter)
      .map((column) =>
        column.field !== 'seasons'
          ? {
              [column.field]: [
                ...new Set(
                  players.data
                    .map((player) => player[column.field])
                    .concat(filterOptions[column.field])
                ),
              ].sort((a, b) => a - b),
            }
          : {
              seasons: seasons.data
                .map((season) => season.season)
                .sort((a, b) => a - b),
            }
      );

    setFilterOptions(Object.assign(...options));
    //update filter count
    setFilteredCount(players.data.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players.data, seasons.data, players.isLoading, seasons.isLoading]);

  function handleFilterChange(selected, { name }) {
    const newFilter = filterChange({ selected, name, currentFilters, columns });
    setCurrentFilters(newFilter);
  }
  function handleSort(selectedSort) {
    const newSort = sortUpdate({ selectedSort, sort });
    setSort(newSort);
  }
  if (players.isLoading || seasons.isLoading) return <Spinner />;

  return (
    <Menus>
      <Table columns={columnWidths}>
        <Table.Header>
          {columns.map((column) => (
            <HeaderSortFilter
              key={column.field}
              header={{
                name: column.field,
                label: column.label,
                type: column.type,
                field: column.field,
                table: column.table,
              }}
              sort={{
                sortDirection: sort[column.table]?.find(
                  (each) => each.field === column.field
                )?.direction,
                defaultSortDirection: column.defaultSortDirection,
                handleSort: handleSort,
              }}
              filters={{
                filter: column.filter,
                handleFilterChange: handleFilterChange,
                options: filterOptions[column.field]?.map((each) => ({
                  label: each,
                  value:
                    column.field === 'seasons'
                      ? seasons.data.find((season) => season.season === each).id
                      : each,
                })),
                currentValue: currentFilters
                  .filter((option) => option.field === column.field)
                  .map((option) => [
                    ...option.value.map((field) => ({
                      value: field,
                      label:
                        column.field === 'seasons'
                          ? seasons.data.find((season) => season.id === field)
                              .season
                          : field,
                    })),
                  ]),
              }}
              isSearchable={column.isSearchable}
            />
          ))}
        </Table.Header>
        {players.data.length === 0 ? (
          <Empty resource="Players" />
        ) : (
          <Table.Body
            data={players.data}
            render={(player) => (
              <PlayerRow player={player} seasons={seasons} key={player.id} />
            )}
          />
        )}
      </Table>
    </Menus>
  );
}
export default PlayerTableAllTime;
