import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
import PlayerRow from './PlayerRow';
import PlayerSeasonRow from './PlayerSeasonRow';
import { usePlayers } from './usePlayers';
import { usePlayerSeasons } from './usePlayerSeasons';

import { useContext, useEffect, useState } from 'react';
import Button from '../../ui/Button';
import Table from '../../ui/Table';
import Empty from '../../ui/Empty';
import Menus from '../../ui/Menus';
import AddPlayer from './AddPlayer';
import { AppContext } from '../../ui/AppLayout';
import Modal from '../../ui/Modal';
import { HiPencil, HiTrash } from 'react-icons/hi2';
import MenuFilterSort from '../../ui/MenuFilterSort';

const StyledDiv = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
`;
const statusFilterLabel = [
  { value: 1, label: 'Rostered' },
  { value: 2, label: 'Trying Out' },
  { value: 3, label: 'Interested' },
  { value: 4, label: 'Not Playing' },
];

function PlayerTable() {
  const { currentSeason } = useContext(AppContext);
  const { isLoadingPlayers, players } = usePlayers();
  const { isLoadingPlayerSeasons, playerSeasons } = usePlayerSeasons();

  const [rosterType, setRosterType] = useState('season');
  const [seasonPlayers, setSeasonPlayers] = useState([]);
  const [unsortedData, setUnsortedData] = useState([]);
  const [unfilteredData, setUnfilteredData] = useState([]);
  useEffect(
    function () {
      if (isLoadingPlayerSeasons) return;
      const seasonFilter = playerSeasons.filter(
        (season) => season.seasonId === +currentSeason
      );
      setSeasonPlayers(seasonFilter);
      setUnfilteredData(seasonFilter);
      setUnsortedData(seasonFilter);
    },
    [playerSeasons, currentSeason, isLoadingPlayerSeasons]
  );

  /// FILTER
  function handleFilter(e) {
    setSeasonPlayers(unfilteredData);
    const filterLabel = statusFilterLabel.find(
      (label) => label.value === +e.target.value
    );
    const filtered = [...unsortedData];
    const filteredPlayers = filtered.filter(
      (player) => player.status === filterLabel.label
    );
    setSeasonPlayers(filteredPlayers);
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
    setSeasonPlayers(sorted);
    setUnfilteredData(sorted);
  }

  function handleOnToggle(val) {
    setRosterType(val);
  }

  if (isLoadingPlayers || isLoadingPlayerSeasons) return <Spinner />;
  // constants  that must load after isLoading

  //If no season selected
  if (!players.length || currentSeason === 'createSeason')
    return <Empty resource="Players" />;

  const seasonTable = {
    head: (
      <MenuFilterSort>
        <div></div>
        <div>
          <div>
            <button
              value="lastName"
              name="string"
              onClick={handleSortClickSeason}
            >
              Player
            </button>

            {/* <MenuFilterSort.Menu>
              <MenuFilterSort.Toggle id="filter"></MenuFilterSort.Toggle>
            </MenuFilterSort.Menu> */}
          </div>
        </div>
        <div>
          <button value="status" name="string" onClick={handleSortClickSeason}>
            Status
          </button>
          <select onChange={handleFilter}>
            <option value="none">No Filter</option>
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
        <div>Team</div>
        <div></div>
      </MenuFilterSort>
    ),
    columns: '0.2fr 2fr 1fr .5fr .5fr .5fr .5fr 1fr .2fr;',
  };
  const table = {
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

  const isSeason = rosterType === 'season';
  return (
    <>
      <StyledDiv>
        <div>
          <Button
            variation={isSeason ? 'primary' : 'secondary'}
            onClick={() => handleOnToggle('season')}
          >
            Current SEASON
          </Button>
          <Button
            variation={rosterType === 'allTime' ? 'primary' : 'secondary'}
            onClick={() => handleOnToggle('allTime')}
          >
            ALL TIME
          </Button>
        </div>
        <AddPlayer />
      </StyledDiv>
      <Menus>
        <Table columns={isSeason ? seasonTable.columns : table.columns}>
          <Table.Header>
            {isSeason ? seasonTable.head : table.head}
          </Table.Header>
          <Table.Body
            data={isSeason ? seasonPlayers : players}
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
