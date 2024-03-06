import Spinner from '../../ui/Spinner';

import { usePlayerSeasons } from './usePlayerSeasons';
import { useSeason } from '../seasons/useSeasons';

import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

import PlayerSeasonRow from './PlayerSeasonRow';

import Table from '../../ui/Table';
import Empty from '../../ui/Empty';
import Menus from '../../ui/Menus';
import HeaderSortFilter from '../../ui/HeaderSortFilter';

// import { HiPencil, HiTrash } from 'react-icons/hi2';

//FILTER HELPERS
import {
  statusFilterLabel,
  defaultVisiblePlayers,
  visibleRosterStatus,
  filterRosterStatus,
  defaultRosterStatus,
  filterBySeasonPhase,
} from '../../utils/filterHelpers';

import { useEffect, useState } from 'react';

const seasonColumns = [
  {
    label: 'Player',
    field: 'fullnamelast',
    type: 'string',
    sort: true,
    defaultSortAsc: true,
  },

  {
    label: 'Status',
    field: 'status',
    type: 'string',
    sort: true,
    filter: true,
    defaultFilter: true,
    defaultSortAsc: null,
  },
  {
    label: 'DOB',
    field: 'dateOfBirth',
    type: 'date',
    defaultSortAsc: null,
  },
  {
    label: 'Entry Year',
    field: 'entryYear',
    type: 'number',
    filter: true,
    defaultSortAsc: true,
  },
  {
    label: 'Grade',
    field: 'grade',
    type: 'number',
    filter: true,
    defaultSortAsc: false,
  },
  {
    label: 'Returner',
    field: 'returningPlayer',
    type: 'boolean',
    filter: true,
    defaultSortAsc: null,
  },
  {
    label: 'Enrolled Last Year',
    field: 'enrolledLastYear',
    type: 'boolean',
    filter: true,
    defaultSortAsc: null,
  },
  {
    label: 'Lives With Parents',
    field: 'livesWithParents',
    type: 'boolean',
    filter: true,
    defaultSortAsc: null,
  },
  {
    label: 'Team',
    field: 'teamLevel',
    type: 'string',
    filter: true,
    defaultSortAsc: null,
  },
];

function PlayerTableSeasons({ setFilteredCount }) {
  const { currentSeason } = useCurrentSeason();

  const { isLoadingSeason, season } = useSeason();
  const { isLoadingPlayerSeasons, playerSeasons } =
    usePlayerSeasons(currentSeason);

  const [selectedOption, setSelectedOption] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortValues, setSortValues] = useState([]);

  useEffect(
    //on LOAD with a new object with needed fields
    function () {
      if (isLoadingPlayerSeasons || isLoadingSeason) return;
      const defaultFilter = filterBySeasonPhase(season);
      const value = statusFilterLabel.find(
        (status) => status.value === +defaultFilter.value
      ).label;
      seasonColumns
        .filter((column) => column.defaultFilter)
        .map((column) =>
          handleFilterChange([{ value, label: value }], { name: column.field })
        );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoadingPlayerSeasons, isLoadingSeason, currentSeason]
  );

  function handleFilterChange(selected, { name }) {
    //set data to either Sorted unless no current sort
    let data = sortValues.length ? sortValues : playerSeasons;

    //FILTER OPTIONS
    //get the current and previous Filter Options
    const prevOptions = selectedOption.filter((option) => option.name !== name);
    const curOptions = { name, selected };
    //combine them and add to state
    const newOptions = [...prevOptions, curOptions];
    setSelectedOption(newOptions);

    //FILTER DATA
    //get previous and curent filters
    const prevFilter = prevOptions.map((type) => [
      ...new Set(
        [].concat(
          ...type.selected.map((value) =>
            data.filter((player) => player[type.name] === value.value)
          )
        )
      ),
    ]);
    const curFilter = [
      ...new Set(
        [].concat(
          ...selected.map((value) =>
            data.filter((player) => player[name] === value.value)
          )
        )
      ),
    ];
    //filter data based on previous and current then set state
    prevFilter.map(
      (item) =>
        (data =
          prevOptions.length &&
          prevOptions.filter((filter) => filter.selected.length).length
            ? data.filter((element) => item.includes(element))
            : data)
    );

    data = selected.length
      ? data.filter((element) => curFilter.includes(element))
      : data;

    setFilteredData(data);
    setFilteredCount(data.length);
  }
  function handleSort(values) {
    const sortedValues = values.map((val) => val); // this is needed to render
    setSortValues(sortedValues);
  }
  if (isLoadingPlayerSeasons || isLoadingSeason) return <Spinner />;
  if (playerSeasons.length === 0) return <Empty resource="Players" />;

  return (
    <Menus>
      <Table columns="1.5fr 1fr .75fr 0.5fr 0.25fr 0.5fr 0.5fr 0.5fr 1.25fr 0.2fr;">
        <Table.Header>
          {seasonColumns.map((column) => (
            <HeaderSortFilter
              key={column.field}
              header={{
                name: column.field,
                label: column.label,
                type: column.type,
                field: column.field,
              }}
              values={filteredData}
              sort={{
                defaultSortAsc: column.defaultSortAsc,
                handleSort: handleSort,
              }}
              filters={{
                filter: column.filter,
                handleFilterChange: handleFilterChange,
                options: [
                  ...new Set(
                    playerSeasons
                      .filter((each) => each[column.field])
                      .map((each) => each[column.field])
                  ),
                ].map((each) => ({ value: each, label: each })),
                defaultValue: selectedOption.filter(
                  (option) => option.name === column.field
                )[0]?.selected,
              }}
            />
          ))}
        </Table.Header>
        <Table.Body
          data={filteredData}
          render={(player) => (
            <PlayerSeasonRow
              playerSeason={player}
              key={player.id}
              teams={season.teamLevels}
            />
          )}
        />
      </Table>
    </Menus>
  );
}
export default PlayerTableSeasons;
