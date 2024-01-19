import styled from 'styled-components';
import Spinner from '../../ui/Spinner';

import { usePlayers } from './usePlayers';
import { usePlayerSeasons } from './usePlayerSeasons';
import { useSeason } from '../seasons/useSeasons';
// import {} from '../uniforms/useUniforms';

import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

import PlayerSeasonRow from './PlayerSeasonRow';
import PlayerRow from './PlayerRow';

import Button from '../../ui/Button';
import Table from '../../ui/Table';
import Empty from '../../ui/Empty';
import Menus from '../../ui/Menus';
import Modal from '../../ui/Modal';
import HeaderSortFilter from '../../ui/HeaderSortFilter';
import MenuFilterSort from '../../ui/MenuFilterSort';
import { flattenObject } from '../../utils/helpers';

import AddPlayer from './AddPlayer';
// import { HiPencil, HiTrash } from 'react-icons/hi2';

//FILTER HELPERS
import { useSearchParams } from 'react-router-dom';
import {
  statusFilterLabel,
  filterRosterStatus,
} from '../../utils/filterHelpers';

import { useEffect, useState } from 'react';
import Players from '../../pages/Players';

const StyledDiv = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
`;

function PlayerTable() {
  let seasonPlayers = [];
  const [searchParams] = useSearchParams();
  const { currentSeason } = useCurrentSeason();
  const { isLoadingSeason, season } = useSeason();

  const { isLoadingPlayerSeasons, playerSeasons } = usePlayerSeasons();
  const [sortValues, setSortValues] = useState([]);
  //SET FILTER
  let statusFilter;
  let filteredPlayers = [];
  let playerSeasonData = [];

  if (isLoadingPlayerSeasons || isLoadingSeason) return <Spinner />;
  //If no season selected or no players
  if (!playerSeasons?.length || currentSeason === 'createSeason')
    return <Empty resource="Players" />;
  const flattenedData = playerSeasons.map((player) => ({
    ...flattenObject(player),
    fullName: `${player.players.people.firstName} ${player.players.people.lastName}`,
    fullNameLast: `${player.players.people.lastName}, ${player.players.people.firstName}`,
  }));

  playerSeasonData = flattenedData;

  // console.log(playerSeasonData);

  /// FILTER
  const rosterStatus = searchParams.get('filterRosterStatus');

  const filter = filterRosterStatus(playerSeasons, rosterStatus, season);
  statusFilter = filter.filterStatus;
  filteredPlayers = filter.filteredPlayers;

  //SORT
  // function handleSortClickSeason(e) {
  //   e.preventDefault();
  //   let [field, direction] = e.target.value.split('-');
  //   direction = !direction ? 'true' : direction;
  //   const modifier = direction === 'false' ? -1 : 1;
  //   const sorted = [...seasonPlayers];

  //   if (e.target.name === 'string')
  //     sorted.sort((a, b) => {
  //       const aa = a[field].toLowerCase();
  //       const bb = b[field].toLowerCase();
  //       if (aa < bb) {
  //         return -1 * modifier;
  //       }
  //       if (aa > bb) {
  //         return 1 * modifier;
  //       }
  //       return 0;
  //     });
  //   else sorted.sort((a, b) => (a[field] - b[field]) * modifier);
  //   e.target.value = `${field}-${direction === 'true' ? 'false' : 'true'}`;
  //   seasonPlayers = sorted;
  // }
  const seasonColumns = [
    {
      label: 'Player',
      field: 'fullNameLast',
      type: 'string',
      sort: true,
      filter: 'string',
      defaultSortAsc: true,
    },

    {
      label: 'Status',
      field: 'status',
      type: 'string',
      sort: true,
      filter: 'string',
      defaultFilter: '',
      defaultSortAsc: null,
    },
    {
      label: 'DOB',
      field: 'players.dateOfBirth',
      type: 'date',
      filter: 'date',
      defaultSortAsc: null,
    },
    {
      label: 'Entry Year',
      field: 'players.entryYear',
      type: 'number',
      filter: 'number',
      defaultSortAsc: true,
    },
    {
      label: 'Grade',
      field: 'grade',
      type: 'number',
      filter: 'number',
      defaultSortAsc: false,
    },
    {
      label: 'Returner',
      field: 'returningPlayer',
      type: 'boolean',
      filter: 'boolean',
      defaultSortAsc: null,
    },
    {
      label: 'Enrolled Last Year',
      field: 'enrolledLastYear',
      type: 'boolean',
      filter: 'boolean',
      defaultSortAsc: null,
    },
    {
      label: 'Lives With Parents',
      field: 'livesWithParents',
      type: 'boolean',
      filter: 'boolean',
      defaultSortAsc: null,
    },
    {
      label: 'Team',
      field: 'teamLevel',
      type: 'string',
      filter: 'string',
    },
  ];
  // const allTimeColumns = {};

  // const seasonTable = {
  //   head: (
  //     <MenuFilterSort>
  //       <div>
  //         <div>
  //           <button
  //             value="lastName"
  //             name="string"
  //             onClick={handleSortClickSeason}
  //           >
  //             Player
  //           </button>
  //         </div>
  //       </div>
  //       <div>
  //         <button value="status" name="string" onClick={handleSortClickSeason}>
  //           Status
  //         </button>

  //       </div>
  //       <div>DOB</div>
  //       <div>Entry Year</div>
  //       <div>
  //         <button value="grade" onClick={handleSortClickSeason}>
  //           Grade
  //         </button>
  //       </div>
  //       <div>
  //         <button value="returningPlayer" onClick={handleSortClickSeason}>
  //           Returner
  //         </button>
  //       </div>
  //       <div>Enrolled Last Year</div>
  //       <div>Lives With Parents</div>
  //       <div>Team</div>
  //       <div></div>
  //     </MenuFilterSort>
  //   ),
  //   columns: '2fr 1fr 1fr 0.5fr 0.25fr 0.5fr 0.5fr 0.5fr 1.25fr 0.2fr;',
  // };

  // const tableValues = {
  //   head: (
  //     <>
  //       <div></div>
  //       <div>Player</div>
  //       <div>DOB</div>
  //       <div></div>
  //     </>
  //   ),
  //   columns: '0.2fr 2fr 1fr .2fr;',
  // };

  // const isSeason = true;
  function handleSort(values) {
    const sortedValues = values.map((val) => val); // this is needed to render
    setSortValues(sortedValues);
    // console.log(sortedValues);
    playerSeasonData = sortedValues;
  }

  return (
    <>
      <StyledDiv>
        <div> TODO Button to select All-Time</div>
        <AddPlayer />
      </StyledDiv>
      <Menus>
        <Table columns="2fr 1fr 1fr 0.5fr 0.25fr 0.5fr 0.5fr 0.5fr 1.25fr 0.2fr;">
          {/* <Table columns={isSeason ? seasonTable.columns : tableValues.columns}> */}
          {/* <Table.Header>
            {isSeason ? seasonTable.head : tableValues.head}
          </Table.Header> */}
          <Table.Header>
            {seasonColumns.map((column) => (
              <HeaderSortFilter
                key={column.field}
                name={column.field}
                label={column.label}
                type={column.type}
                values={playerSeasonData}
                defaultSortAsc={column.defaultSortAsc}
                handleSort={handleSort}
              />
            ))}
          </Table.Header>
          <Table.Body
            data={sortValues.length > 0 ? sortValues : playerSeasonData}
            // data={playerSeasonData}
            render={
              (player) => (
                <PlayerSeasonRow playerSeason={player} key={player.id} />
              )
              // isSeason ? (
              //   <PlayerSeasonRow playerSeason={player} key={player.id} />
              // ) : (
              //   <PlayerRow player={player} key={player.id} />
              // )
            }
          />
        </Table>
      </Menus>
    </>
  );
}

export default PlayerTable;
