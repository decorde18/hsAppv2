import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
import PlayerRow from './PlayerRow';
import PlayerSeasonRow from './PlayerSeasonRow';
import { usePlayers } from './usePlayers';
import { usePlayerSeasons } from './usePlayerSeasons';
import { useSeason } from '../seasons/useSeasons';

import { useEffect, useState } from 'react';
import Button from '../../ui/Button';
import Table from '../../ui/Table';
import Empty from '../../ui/Empty';
import Menus from '../../ui/Menus';
import AddPlayer from './AddPlayer';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import Modal from '../../ui/Modal';
import { HiPencil, HiTrash } from 'react-icons/hi2';
import MenuFilterSort from '../../ui/MenuFilterSort';
import {} from '../uniforms/useUniforms';
import { useSearchParams } from 'react-router-dom';

const StyledDiv = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
`;
const statusFilterLabel = [
  { value: 0, label: 'No Filter' },
  { value: 1, label: 'Rostered' },
  { value: 2, label: 'Trying Out', seasonPhase: 'tryout' },
  { value: 3, label: 'Interested', seasonPhase: 'pre-Tryout' },
  { value: 4, label: 'Not Playing' },
];

function PlayerTable() {
  const { currentSeason } = useCurrentSeason();
  const { isLoadingSeason, season } = useSeason();

  const { isLoadingPlayerSeasons, playerSeasons } = usePlayerSeasons();
  const [rosterType, setRosterType] = useState('season');
  // const [seasonPlayers, setSeasonPlayers] = useState([]);
  let seasonPlayers = [];
  const [searchParams, setSearchParams] = useSearchParams();
  // const [statusFilter, setStatusFilter] = useState();

  // const [unsortedData, setUnsortedData] = useState([]);
  // const [unfilteredData, setUnfilteredData] = useState([]);
  // const memo = useMemo(() => <Table />);
  //SET FILTER
  let statusFilter;
  let filteredPlayers = [];

  if (isLoadingPlayerSeasons || isLoadingSeason) return <Spinner />;

  /// FILTER
  const rosterStatus = searchParams.get('rosterStatus');
  //SET FILTER IN SEARCH PARAMS
  function handleFilter({ filter, value }) {
    searchParams.set(filter, value);
    setSearchParams(searchParams);
  }
  //ON LOAD DEFAULT FILTER STATUS
  if (!rosterStatus) {
    const defaultStatusFilter = statusFilterLabel.find(
      (phase) => phase?.seasonPhase === season.seasonPhase
    );
    statusFilter = defaultStatusFilter?.value || 1;
    filteredPlayers = playerSeasons.filter(
      (player) =>
        player?.status ==
        statusFilterLabel.find((label) => {
          if (+label.value === statusFilter) return label.label;
        }).label
    );
  } else {
    //FILTER ON CHANGE
    if (+rosterStatus === 0) filteredPlayers = playerSeasons;
    else
      filteredPlayers = playerSeasons.filter(
        (player) =>
          player?.status ==
          statusFilterLabel.find((label) => {
            if (+label.value === +rosterStatus) return label.label;
          }).label
      );
  }
  //SORT
  function handleSortClickSeason(e) {
    e.preventDefault();
    let [field, direction] = e.target.value.split('-');
    direction = !direction ? 'true' : direction;
    const modifier = direction === 'false' ? -1 : 1;
    const sorted = [...seasonPlayers];

    if (e.target.name === 'string')
      sorted.sort((a, b) => {
        const aa = a[field].toLowerCase();
        const bb = b[field].toLowerCase();
        if (aa < bb) {
          return -1 * modifier;
        }
        if (aa > bb) {
          return 1 * modifier;
        }
        return 0;
      });
    else sorted.sort((a, b) => (a[field] - b[field]) * modifier);
    e.target.value = `${field}-${direction === 'true' ? 'false' : 'true'}`;
    seasonPlayers = sorted;
  }

  //If no season selected
  if (!playerSeasons.length || currentSeason === 'createSeason')
    return <Empty resource="Players" />;

  const seasonTable = {
    head: (
      <MenuFilterSort>
        <div>
          <div>
            <button
              value="lastName"
              name="string"
              onClick={handleSortClickSeason}
            >
              Player
            </button>
          </div>
        </div>
        <div>
          <button value="status" name="string" onClick={handleSortClickSeason}>
            Status
          </button>
          <select
            value={statusFilter}
            onChange={(e) =>
              handleFilter({
                filter: 'rosterStatus',
                value: e.target.value,
              })
            }
          >
            {statusFilterLabel.map((label) => (
              <option value={label.value} key={label.value}>
                {label.label}
              </option>
            ))}
          </select>
        </div>
        <div>DOB</div>
        <div>Entry Year</div>
        <div>
          <button value="grade" onClick={handleSortClickSeason}>
            Grade
          </button>
        </div>
        <div>
          <button value="returningPlayer" onClick={handleSortClickSeason}>
            Returner
          </button>
        </div>
        <div>Enrolled Last Year</div>
        <div>Lives With Parents</div>
        <div>Team</div>
        <div></div>
      </MenuFilterSort>
    ),
    columns: '2fr 1fr 1fr 0.5fr 0.25fr 0.5fr 0.5fr 0.5fr 1.5fr 0.2fr;',
  };

  const tableValues = {
    head: (
      <>
        <div></div>
        <div>Player</div>
        <div>DOB</div>
        <div></div>
      </>
    ),
    columns: '0.2fr 2fr 1fr .2fr;',
  };

  const isSeason = true; //TODO this will allow season vs. all-time - needs to be created, some things are added below
  return (
    <>
      <StyledDiv>
        <AddPlayer />
      </StyledDiv>
      <Menus>
        <Table columns={isSeason ? seasonTable.columns : tableValues.columns}>
          <Table.Header>
            {isSeason ? seasonTable.head : tableValues.head}
          </Table.Header>
          <Table.Body
            data={filteredPlayers}
            render={(player) =>
              isSeason ? (
                <PlayerSeasonRow playerSeason={player} key={player.id} />
              ) : (
                <PlayerRow player={player} key={player.id} />
              )
            }
          />
        </Table>
      </Menus>
    </>
  );
}

export default PlayerTable;
