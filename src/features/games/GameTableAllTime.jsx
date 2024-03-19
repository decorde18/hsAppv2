import { useEffect, useState } from 'react';

import { useData } from '../../services/useUniversal';

import { filterChange, sortUpdate } from '../../utils/filterHelpers';

import Table from '../../ui/Table';
import Empty from '../../ui/Empty';
import Menus from '../../ui/Menus';
import HeaderSortFilter from '../../ui/HeaderSortFilter';
import Spinner from '../../ui/Spinner';

import GameRow from './GameRow';

const columns = [
  //UPDATE FOR APPROPRIATE TABLE
  {
    table: 'games',
    label: 'Date',
    field: 'date',
    type: 'date',
    filter: false,
    sort: true,
    sortPriority: 1,
    defaultSortDirection: true,
    width: '.75fr',
    columnType: 'string',

    isSearchable: false,
  },
  {
    table: 'games',
    label: 'Time',
    field: 'time',
    type: 'time',

    filter: false,
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    width: '.75fr',
    isSearchable: false,
  },
  {
    table: 'games',
    label: 'Opponent',
    field: 'school',
    type: 'text',
    filter: true,
    sort: false,
    defaultSortDirection: true,
    width: '3.5fr',
    isSearchable: false,
  },
  {
    table: 'games',
    label: 'Result',
    field: 'result',
    type: 'string',
    filter: true,
    sort: false,
    defaultSortDirection: true,
    width: '.75fr',
    isSearchable: false,
  },
  {
    table: 'games',
    label: 'Location',
    field: 'locationName',
    type: 'string',
    filter: true,
    sort: false,
    defaultSortDirection: true,
    width: '2.5fr',
    isSearchable: false,
  },
  {
    table: 'games',
    label: 'Team',
    field: 'teamType',
    type: 'string',
    filter: true,
    sort: false,
    defaultSortDirection: true,
    width: '1fr',
    isSearchable: false,
  },
  {
    table: 'games',
    label: 'Type',
    field: 'seasonTime',
    type: 'string',
    filter: true,
    sort: false,
    defaultSortDirection: true,
    width: '1fr',
    isSearchable: false,
  },
  {
    table: 'games',
    label: 'Comment',
    field: 'comment',
    filter: false,
    type: 'string',
    width: '2.5fr',
    isSearchable: false,
  },

  { width: '0.2fr', field: 'options' },
];

function GameTable({ setFilteredCount }) {
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
  const games = useData({
    //UPDATE FOR APPROPRIATE TABLE
    table: 'games',
    filter: currentFilters.filter((option) => option.table === 'games'),
    sort: sort.games,
  });

  useEffect(() => {
    if (games.isLoading) return; //UPDATE FOR APPROPRIATE TABLE
    //update filterOptions if needed
    const options = columns
      .filter((column) => column.filter)
      .map(
        (
          column //this is if we have an odd column that needs more information other than that which is in the results (ie this is stored as season Id, but we need to see the season, not the id)
        ) => ({
          [column.field]: [
            ...new Set(
              games.data //UPDATE FOR APPROPRIATE TABLE
                .map((game) => game[column.field])
                .concat(filterOptions[column.field])
            ),
          ].sort((a, b) => a - b),
        })
      );

    setFilterOptions(Object.assign(...options));
    //update filter count
    setFilteredCount(games.data.length); //UPDATE FOR APPROPRIATE TABLE
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [games.data, games.isLoading]); //UPDATE FOR APPROPRIATE TABLE

  function handleFilterChange(selected, { name }) {
    const newFilter = filterChange({ selected, name, currentFilters, columns });
    setCurrentFilters(newFilter);
  }
  function handleSort(selectedSort) {
    const newSort = sortUpdate({ selectedSort, sort });
    setSort(newSort);
  }
  if (games.isLoading) return <Spinner />; //UPDATE FOR APPROPRIATE TABLE
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
                  value: each, //UPDATE FOR APPROPRIATE TABLE
                })),
                currentValue: currentFilters
                  .filter((option) => option.field === column.field)
                  .map((option) => [
                    ...option.value.map((field) => ({
                      value: field,
                      label: field, //UPDATE FOR APPROPRIATE TABLE
                    })),
                  ]),
              }}
              isSearchable={column.isSearchable}
            />
          ))}
        </Table.Header>
        {games.data.length === 0 ? (
          <Empty resource="Games" /> //UPDATE FOR APPROPRIATE TABLE
        ) : (
          <Table.Body
            data={games.data}
            render={(game) => (
              <GameRow game={game} key={game.id} /> //UPDATE FOR APPROPRIATE TABLE
            )}
          />
        )}
      </Table>
    </Menus>
  );
}
export default GameTable; //UPDATE FOR APPROPRIATE TABLE

// import styled from 'styled-components';
// import Spinner from '../../ui/Spinner';

// import { useGames } from './useGames';
// import { useGoals, useGamePeriods } from './useGames';

// import { useEffect, useState } from 'react';
// import Button from '../../ui/Button';
// import Table from '../../ui/Table';
// import Empty from '../../ui/Empty';
// import GameRow from './GameRow';
// import AddGame from './AddGame';
// import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
// import Menus from '../../ui/Menus';

// import { useSeason } from '../seasons/useSeasons';

// const StyledDiv = styled.div`
//   display: flex;
//   gap: 2px;
//   justify-content: space-between;
// `;
// function GameTable() {
//   // Calendar();
//   const { currentSeason } = useCurrentSeason();
//   const { isLoadingSeason, season } = useSeason();

//   const [scheduleType, setScheduleType] = useState('season');
//   const { isLoadingGames, games } = useGames();

//   const [seasonGames, setSeasonGames] = useState([]);

//   const { isLoadingGoals, goals } = useGoals(currentSeason);

//   useEffect(
//     function () {
//       if (isLoadingGames || isLoadingSeason) return;
//       setSeasonGames(games);
//     },
//     [games, isLoadingGames, isLoadingSeason, seasonGames]
//   );

//   function handleOnToggle(val) {}

//   if (isLoadingGames || isLoadingGoals) return <Spinner />;
//   if (!seasonGames.length || currentSeason === 'createSeason')
//     return (
//       <>
//         <Empty resource="Games" />
//         <AddGame />
//       </>
//     );

//   const gamesWithGoals = seasonGames.map((game) => ({
//     ...seasonGames,
//     goals: goals.filter((goal) => goal.periodId.game.id === game.id),
//   }));
//   const gamesSeasonWithGoals = seasonGames.map((game) => ({
//     ...game,
//     goals: goals.filter((goal) => goal.periodId.game.id == game.id),
//   }));

//   return (
//     <Menus>
//       <StyledDiv>
//         <div>
//           <Button
//             variation={scheduleType === 'season' ? 'primary' : 'secondary'}
//             onClick={() => handleOnToggle('season')}
//           >
//             Current SEASON
//           </Button>
//           <Button
//             variation={scheduleType === 'allTime' ? 'primary' : 'secondary'}
//             onClick={() => handleOnToggle('allTime')}
//           >
//             ALL TIME
//           </Button>
//         </div>
//         <AddGame />
//       </StyledDiv>

//           <div></div>
//         </Table.Header>
//         <Table.Body
//           data={
//             scheduleType === 'season' ? gamesSeasonWithGoals : gamesWithGoals
//           }
//           render={(game) => <GameRow game={game} key={game.id} />}
//         />
//       </Table>
//     </Menus>
//   );
// }

// export default GameTable;
