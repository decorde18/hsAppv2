import styled from 'styled-components';
import Spinner from '../../ui/Spinner';

import { usePlayers } from './usePlayers';
import { useSeason, useSeasons } from '../seasons/useSeasons';
// import {} from '../uniforms/useUniforms';

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
import Players from '../../pages/Players';
import PlayerRow from './PlayerRow';

const StyledDiv = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
`;
const allTimeColumns = [
  {
    label: 'Player',
    field: 'fullnamelast',
    type: 'string',
    sort: true,
    defaultSortAsc: true,
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
    label: 'Seasons',
    field: 'seasonsPlayed',
    type: 'string',
    filter: true,
    defaultSortAsc: true,
  },
];
function PlayerTableAllTime({ setFilteredCount }) {
  const { isLoadingPlayers, players } = usePlayers();
  const { isLoadingSeasons, seasons } = useSeasons();

  const [selectedOption, setSelectedOption] = useState([]);
  const [originalData, setOriginalData] = useState([]); //needed because I am adding the seasons played in the UseEffect
  const [filteredData, setFilteredData] = useState([]);
  const [sortValues, setSortValues] = useState([]);

  useEffect(() => {
    //Add find seasons played and add to players creating original Data that will be used in filters
    if (isLoadingPlayers || isLoadingSeasons) return;

    const dataWithSeasons = players.map((player) => {
      const string = player.seasons.replace(/['"]+/g, '');
      const arr = string.split(',');
      const array = arr.reduce((acc, item) => {
        acc.push(seasons.find((season) => season.id === +item).season);
        return acc;
      }, []);

      let start, end; // track start and end (updates as range changes)
      end = start = array[0];
      let result = ''; //final string
      array.map((arr, i) => {
        if (arr === start + 1) result += start + '-'; //if consecutive years (first of) add the beginning year and a hyphen
        if (arr !== end) {
          result += end - 1 + ', '; //if non consecutive, add the previous end and a comma
          end = start = arr; //reset to start a new range
        }
        end++; //add for the next consecutive year
        if (i === array.length - 1) result += arr; //add the final year
      });

      return { ...player, seasons: result };
    });
    setFilteredCount(dataWithSeasons.length);
    setOriginalData(dataWithSeasons);
  }, [isLoadingPlayers, isLoadingSeasons, players, seasons, setFilteredCount]);

  function handleFilterChange(selected, { name }) {
    //set data to either Sorted unless no current sort
    let data = sortValues.length ? sortValues : originalData;

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
  if (isLoadingPlayers || isLoadingSeasons) return <Spinner />;
  if (players.length === 0) return <Empty resource="Players" />;

  return (
    <Menus>
      <Table columns="1.5fr 1fr .75fr 0.5fr 0.25fr 0.5fr 0.5fr 0.5fr 1.25fr 0.2fr;">
        <Table.Header>
          {allTimeColumns.map((column) => (
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
                    players
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
          data={filteredData.length || originalData}
          render={(player) => <PlayerRow player={player} key={player.id} />}
        />
      </Table>
    </Menus>
  );
}
export default PlayerTableAllTime;
