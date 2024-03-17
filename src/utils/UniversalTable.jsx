import { useCurrentSeason } from '../contexts/CurrentSeasonContext';
import { useEffect, useState } from 'react';

import { useData } from '../services/useUniversal';

import { filterChange, sortUpdate } from './filterHelpers';

import Table from '../ui/Table';
import Empty from '../ui/Empty';
import Menus from '../ui/Menus';
import HeaderSortFilter from '../ui/HeaderSortFilter';
import Spinner from '../ui/Spinner';

import PlayerRow from '../features/players/PlayerRow'; //UPDATE FOR APPROPRIATE TABLE

const columns = [
  //UPDATE FOR APPROPRIATE TABLE
  {
    table: 'players',
    label: 'Player',
    field: 'fullnamelast',
    type: 'string',
    filter: true,
    defaultFilter: [2, 3, 4], //must be array
    textSearch: true, //needed for finding partial values in strings
    sort: true, //is the sort on for table load
    sortPriority: 1,
    defaultSortDirection: true,
    width: '1.5fr',
    isSearchable: true,
  },

  { width: '0.2fr', field: 'options' },
];

function PlayerTableAllTime({ setFilteredCount }) {
  const { currentSeason } = useCurrentSeason();
  //UPDATE FOR APPROPRIATE TABLE
  const additionalFilters = [
    {
      field: 'seasonId',
      value: currentSeason,
      table: 'playerSeasons',
    },
  ];
  //UPDATE FOR APPROPRIATE TABLE
  const columnWidths = columns.reduce((acc, cur) => {
    return (acc = acc.concat(' ', cur.width));
  }, '');
  const [filterOptions, setFilterOptions] = useState({});
  const [currentFilters, setCurrentFilters] = useState([
    ...columns
      .filter((column) => column.defaultFilter)
      .map((column) => ({
        field: column.field,
        value: column.defaultFilter,
        textSearch: column.text,
        table: column.table,
      })),
    ...additionalFilters,
  ]);

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
    //UPDATE FOR APPROPRIATE TABLE
    table: 'players',
    filter: currentFilters.filter((option) => option.table === 'players'),
    sort: sort.players,
  });
  const seasons = useData({
    //UPDATE FOR APPROPRIATE TABLE
    table: 'seasons',
    filter: currentFilters.filter((option) => option.table === 'seasons'),
  });

  useEffect(() => {
    if (players.isLoading || seasons.isLoading) return; //UPDATE FOR APPROPRIATE TABLE
    //update filterOptions if needed
    const options = columns
      .filter((column) => column.filter)
      .map(
        (
          column //this is if we have an odd column that needs more information other than that which is in the results (ie this is stored as season Id, but we need to see the season, not the id)
        ) =>
          column.field !== 'seasons' //UPDATE FOR APPROPRIATE TABLE
            ? {
                [column.field]: [
                  ...new Set(
                    players.data //UPDATE FOR APPROPRIATE TABLE
                      .map((player) => player[column.field])
                      .concat(filterOptions[column.field])
                  ),
                ].sort((a, b) => a - b),
              }
            : {
                seasons: seasons.data
                  .map((season) => season.season)
                  .sort((a, b) => a - b),
              } //UPDATE FOR APPROPRIATE TABLE
      );

    setFilterOptions(Object.assign(...options));
    //update filter count
    setFilteredCount(players.data.length); //UPDATE FOR APPROPRIATE TABLE
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players.data, seasons.data, players.isLoading, seasons.isLoading]); //UPDATE FOR APPROPRIATE TABLE

  function handleFilterChange(selected, { name }) {
    const newFilter = filterChange({ selected, name, currentFilters, columns });
    setCurrentFilters(newFilter);
  }
  function handleSort(selectedSort) {
    const newSort = sortUpdate({ selectedSort, sort });
    setSort(newSort);
  }
  if (players.isLoading || seasons.isLoading) return <Spinner />; //UPDATE FOR APPROPRIATE TABLE

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
                      : each, //UPDATE FOR APPROPRIATE TABLE
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
                          : field, //UPDATE FOR APPROPRIATE TABLE
                    })),
                  ]),
              }}
              isSearchable={column.isSearchable}
            />
          ))}
        </Table.Header>
        {players.data.length === 0 ? (
          <Empty resource="Players" /> //UPDATE FOR APPROPRIATE TABLE
        ) : (
          <Table.Body
            data={players.data}
            render={(player) => (
              <PlayerRow player={player} seasons={seasons} key={player.id} /> //UPDATE FOR APPROPRIATE TABLE
            )}
          />
        )}
      </Table>
    </Menus>
  );
}
export default PlayerTableAllTime; //UPDATE FOR APPROPRIATE TABLE
