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
//FILTER HELPERS
import { useSearchParams } from 'react-router-dom';
import {
  statusFilterLabel,
  filterRosterStatus,
} from '../../utils/filterHelpers';
import FilterBy from '../../ui/FilterBy';

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
  //SET FILTER
  let statusFilter;
  let filteredPlayers = [];

  if (isLoadingPlayerSeasons || isLoadingSeason) return <Spinner />;
  //If no season selected or no players
  if (!playerSeasons.length || currentSeason === 'createSeason')
    return <Empty resource="Players" />;

  /// FILTER
  const rosterStatus = searchParams.get('filterRosterStatus');

  const filter = filterRosterStatus(playerSeasons, rosterStatus, season);
  statusFilter = filter.filterStatus;
  filteredPlayers = filter.filteredPlayers;

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
          <FilterBy
            options={statusFilterLabel}
            id={'filterRosterStatus'}
            default={statusFilter.value}
          />
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

  const isSeason = true;
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
