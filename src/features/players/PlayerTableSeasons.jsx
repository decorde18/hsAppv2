import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import { useEffect, useState } from 'react';

import { useData, useUpdateData } from '../../services/useUniversal';

import {
  filterBySeasonPhase,
  filterChange,
  sortUpdate,
} from '../../utils/filterHelpers';

import Table from '../../ui/Table';
import Empty from '../../ui/Empty';
import Menus from '../../ui/Menus';
import HeaderSortFilter from '../../ui/HeaderSortFilter';
import Spinner from '../../ui/Spinner';

import PlayerSeasonRow from './PlayerSeasonRow';

const columns = [
  {
    table: 'playerSeasons',
    label: '#',
    field: 'number',
    type: 'number',
    defaultSortDirection: true,
    width: '.25fr',
    columnType: 'string',
  },
  {
    table: 'playerSeasons',
    label: 'Player',
    field: 'fullnamelast',
    type: 'string',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '1.5fr',
    columnType: 'string',
  },

  {
    table: 'playerSeasons',
    label: 'Status',
    field: 'status',
    type: 'string',
    filter: true,
    defaultSortDirection: false,
    width: '1fr',
    columnType: 'string',
  },
  {
    table: 'playerSeasons',
    label: 'DOB',
    field: 'dateOfBirth',
    type: 'date',
    defaultSortDirection: false,
    isSearchable: true,
    width: '.75fr',
    columnType: 'string',
  },
  {
    table: 'playerSeasons',
    label: 'Entry Year',
    field: 'entryYear',
    type: 'number',
    filter: true,
    defaultSortDirection: true,
    width: '0.5fr',
    columnType: 'string',
  },
  {
    table: 'playerSeasons',
    label: 'Grade',
    field: 'grade',
    type: 'number',
    filter: true,
    sort: true,
    sortPriority: 1,
    defaultSortDirection: false,
    width: '0.25fr',
    columnType: 'string',
  },
  {
    table: 'playerSeasons',
    label: 'Returner',
    field: 'returningPlayer',
    type: 'boolean',
    filter: true,
    defaultSortDirection: false,
    width: '0.5fr',
    columnType: 'string',
  },
  {
    table: 'playerSeasons',
    label: 'Enrolled Last Year',
    field: 'enrolledLastYear',
    type: 'boolean',
    filter: true,
    defaultSortDirection: false,
    width: '0.5fr',
    columnType: 'string',
  },
  {
    table: 'playerSeasons',
    label: 'Lives With Parents',
    field: 'livesWithParents',
    type: 'boolean',
    filter: true,
    defaultSortDirection: false,
    width: '0.5fr',
    columnType: 'string',
  },
  {
    table: 'playerSeasons',
    label: 'Team',
    field: 'teamLevel',
    type: 'string',
    filter: true,
    defaultSortDirection: false,
    width: '1.25fr',
    columnType: 'string',
  },
  { width: '0.2fr', field: 'options', columnType: 'string' },
];

function PlayerTableSeasons({ setFilteredCount }) {
  const { currentSeason, currentSeasonNew } = useCurrentSeason();
  const { isUpdating, updateData } = useUpdateData();

  const columnWidths = columns.reduce((acc, cur) => {
    return (acc = acc.concat(' ', cur.width));
  }, '');
  const [filterOptions, setFilterOptions] = useState({});
  const [searchOptions, setSearchOptions] = useState({});
  const [currentFilters, setCurrentFilters] = useState([
    ...columns
      .filter((column) => column.defaultFilter)
      .map((column) => ({
        field: column.field,
        value: column.defaultFilter,
        textSearch: column.text,
        table: column.table,
      })),
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

  const playerSeasons = useData({
    table: 'playerSeasons',
    filter: [
      ...currentFilters.filter((option) => option.table === 'playerSeasons'),
      { field: 'seasonId', value: currentSeasonNew.id, table: 'playerSeasons' },
    ],
    sort: sort.playerSeasons,
  });

  useEffect(() => {
    if (playerSeasons.isLoading) return;
    //update filterOptions if needed
    const options = columns
      .filter((column) => column.filter)
      .map((column) => ({
        [column.field]: [
          ...new Set(
            playerSeasons.data
              .map((player) => player[column.field])
              .concat(filterOptions[column.field])
              .filter((column) => column)
          ),
        ].sort((a, b) => a - b),
      }));

    setFilterOptions(Object.assign(...options));
    //update filter count
    setFilteredCount(playerSeasons.data.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerSeasons.data, playerSeasons.isLoading]);
  useEffect(() => {
    //update default status filter

    const defaultFilter = filterBySeasonPhase(currentSeasonNew);
    handleFilterChange(
      [{ value: defaultFilter.label, label: defaultFilter.value }],
      { name: 'status' }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSeasonNew]);
  function handleFilterChange(selected, { name }) {
    const newFilter = filterChange({ selected, name, currentFilters, columns });
    setCurrentFilters(newFilter);
  }
  function handleSort(selectedSort) {
    const newSort = sortUpdate({ selectedSort, sort });
    setSort(newSort);
  }
  function handleSearchChange(e) {
    //todo ? probably better to create a filter outside and use that data for render, this will only add the searchOptions when changed
    const name = e.target.name;
    const value = e.target.value.toLowerCase();
    const search = {
      ...searchOptions,
      [name]: value,
    };
    delete search.data;
    setSearchOptions({
      ...searchOptions,
      ...search,
      data: Object.keys(search).reduce(
        (acc, each) => [
          ...acc,
          ...playerSeasons.data.filter((record) =>
            record[each]?.toLowerCase().includes(value)
          ),
        ],
        []
      ),
    }); //add filtered data to searchOptions to use in render
  }

  if (playerSeasons.isLoading) return <Spinner />;

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
                handleSearchChange: handleSearchChange,
                options: filterOptions[column.field]?.map((each) => ({
                  label: each,
                  value: each,
                })),
                currentValue: currentFilters
                  .filter((option) => option.field === column.field)
                  .map((option) => [
                    ...option.value.map((field) => ({
                      value: field,
                      label: field,
                    })),
                  ]),
              }}
              isSearchable={column.isSearchable}
            />
          ))}
        </Table.Header>
        {playerSeasons.data.length === 0 ? (
          <Empty resource="Players" />
        ) : (
          <Table.Body
            data={searchOptions.data || playerSeasons.data}
            render={(player) => (
              <PlayerSeasonRow
                playerSeason={player}
                key={player.id}
                teams={currentSeasonNew.teamLevels}
                columns={columns}
              />
            )}
          />
        )}
      </Table>
    </Menus>
  );
}
export default PlayerTableSeasons;
