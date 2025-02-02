import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import { useData } from '../../services/useUniversal';

import CommunicationRow from './CommunicationRow';
import Select from '../../ui/Select';
import HeaderSortFilter from '../../ui/HeaderSortFilter';
import Table from '../../ui/Table';
import Spinner from '../../ui/Spinner';
import Empty from '../../ui/Empty';

import { convertSBdateToLocalDate } from '../../utils/helpers';
import {
  defaultRosterStatus,
  statusFilterLabel,
} from '../../utils/filterHelpers';

const ACTIONS = {
  SET_PLAYERS: 'SET_PLAYERS',
  FILTER_PLAYERS: 'FILTER_PLAYERS',
};

function CommunicationTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentSeason } = useCurrentSeason();
  const season = currentSeason.id;
  const defaultFilter = defaultRosterStatus(currentSeason);

  const [playerEmails, setPlayerEmails] = useState([]);
  const [parentEmails, setParentEmails] = useState([]);
  const players = useRef([]);
  const [statusFilter, setStatusFilter] = useState({});
  const [sortConfig, setSortConfig] = useState([
    {
      field: 'grade', // Default sort field
      direction: 'desc', // Default direction ('asc' or 'desc')
    },
    { field: 'lastName', direction: 'asc' },
    { field: 'firstName', direction: 'asc' },
  ]);

  const initialState = {
    filteredPlayers: [],
  };

  const { isLoading: isLoadingPlayerSeasons, data: playerSeasons = [] } =
    useData({
      table: 'playerSeasons',
      filter: [{ field: 'seasonId', value: season }],
    });

  // Extract unique playerIds only after playerSeasons loads
  const playerIds = useMemo(() => {
    return playerSeasons.length > 0
      ? [...new Set(playerSeasons.map((player) => player.playerId))]
      : [];
  }, [playerSeasons]);

  // Don't run the second query if playerIds is empty
  const { isLoading: isLoadingPlayerParents, data: playerParents } = useData({
    table: 'playerParents',
    filter:
      playerIds.length > 0
        ? [{ field: 'player', array: true, value: playerIds }]
        : [{ field: 'player', array: true, value: [-1] }], // Dummy filter to prevent errors
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (isLoadingPlayerSeasons || isLoadingPlayerParents) return;
    updatePlayerParents();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingPlayerSeasons, isLoadingPlayerParents]);

  function updatePlayerParents() {
    players.current = playerSeasons.map((player) => ({
      ...player,
      parents: playerParents.filter(
        (parent) => parent.player === player.playerId
      ),
    }));
    handleFilterChange();
  }
  function addPlayer({ email, playerId }) {
    if (playerEmails.some((play) => play.id === playerId)) return;
    setPlayerEmails((prev) => [...prev, { id: playerId, email }]);
  }
  function removePlayer({ playerId }) {
    setPlayerEmails((prev) => prev.filter((player) => player.id !== playerId));
  }
  function addParent({ email, playerId, parentId }) {
    if (
      parentEmails.some(
        (parent) => parent.id === parentId && parent.playerId === playerId
      )
    )
      return;
    setParentEmails((prev) => [...prev, { playerId, id: parentId, email }]);
  }
  function removeParent({ playerId, parentId }) {
    setParentEmails((prev) =>
      prev.filter(
        (parent) => !(parent.playerId === playerId && parent.id === parentId)
      )
    );
  }
  function handlePlayerChange(data) {
    if (data.checked) addPlayer(data);
    else removePlayer(data);
  }
  function handleParentChange(data) {
    if (data.checked) addParent(data);
    else removeParent(data);
  }
  function handleRowClick(data) {
    if (data.checked) {
      if (data.name !== 'parents') addPlayer(data.player);
      data.player.parents.forEach((parent) =>
        addParent({
          parentId: parent.id,
          email: parent.email,
          playerId: data.player.playerId,
        })
      );
    } else {
      if (data.name !== 'parents') removePlayer(data.player);
      data.player.parents.map((parent) =>
        removeParent({ playerId: data.player.playerId, parentId: parent.id })
      );
    }
  }
  function handleAllPlayerChecked(e) {
    if (e.target.checked)
      setPlayerEmails(
        state.filteredPlayers.map((player) => ({
          id: player.playerId,
          email: player.email,
        }))
      );
    else setPlayerEmails([]);
  }
  function handleAllParentsChecked(e) {
    if (e.target.checked)
      setParentEmails(
        state.filteredPlayers
          .map((player) =>
            player.parents.map((parent) => ({
              playerId: player.playerId,
              id: parent.id,
              email: parent.email,
            }))
          )
          .flat()
      );
    else setParentEmails([]);
  }
  // function handleSort(field) {
  //   //const dateDiff =
  //   //   new Date(convertSBdateToLocalDate(b.created_at)) -
  //   //   new Date(convertSBdateToLocalDate(a.created_at));
  //   // if (dateDiff !== 0) return dateDiff;
  //   setSortConfig((prev) => ({
  //     field,
  //     direction:
  //       prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc', // Toggle direction if same field
  //   }));
  // }
  function handleSort(field, addToSort = false) {
    setSortConfig((prev) => {
      // Find existing sort rule
      const existingSortIndex = prev.findIndex((rule) => rule.field === field);
      let newSortConfig = [...prev];

      if (existingSortIndex !== -1) {
        // Toggle direction if already sorted
        newSortConfig[existingSortIndex] = {
          ...newSortConfig[existingSortIndex],
          direction:
            newSortConfig[existingSortIndex].direction === 'asc'
              ? 'desc'
              : 'asc',
        };
      } else {
        // Add new sort rule
        newSortConfig = addToSort
          ? [...prev, { field, direction: 'asc' }]
          : [{ field, direction: 'asc' }];
      }

      return addToSort ? newSortConfig : [newSortConfig.pop()];
    });
  }

  function handleFilterChange(
    filterValue = +searchParams.get('filterRosterStatus') || defaultFilter.value
  ) {
    setStatusFilter({ value: filterValue });

    dispatch({
      type: ACTIONS.SET_PLAYERS,
      payload: filterPlayers(filterValue),
    });

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('filterRosterStatus', filterValue);
      return newParams;
    });

    function filterPlayers(filterValue) {
      const filterLabel = statusFilterLabel.find(
        (status) => status.value === +filterValue
      );

      return filterValue === 0
        ? players.current
        : players.current.filter(
            (player) => player.status === filterLabel.label
          );
    }
  }

  function reducer(state, action) {
    switch (action.type) {
      case ACTIONS.SET_PLAYERS:
        return { ...state, filteredPlayers: action.payload };
      case ACTIONS.FILTER_PLAYERS:
        return {
          ...state,
          filteredPlayers: players.current.filter(
            (player) => player.status === action.payload
          ),
        };
      default:
        return state;
    }
  }
  const sortedFilteredPlayers = useMemo(() => {
    return [...state.filteredPlayers].sort((a, b) => {
      for (const sortRule of sortConfig) {
        const { field, direction } = sortRule;
        let aValue = a[field];
        let bValue = b[field];

        // Normalize case for string comparison
        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();

        // Compare values
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;

        // If values are equal, move to the next sortRule in the list
      }
      return 0; // All values are equal, maintain order
    });
  }, [state.filteredPlayers, sortConfig]);
  // Runs when filtered players or sorting config changes

  if (
    isLoadingPlayerParents ||
    isLoadingPlayerSeasons ||
    !players.current.length
  )
    return <Spinner />;
  if (!playerParents.length) return <Empty resource="Player Parents" />;

  return (
    <>
      <input
        defaultValue={[
          ...new Set(
            playerEmails
              .map((obj) => obj.email)
              .filter((email) => email && email.trim() !== '')
          ),
        ]}
      />
      <input
        defaultValue={[
          ...new Set(
            parentEmails
              .map((obj) => obj.email)
              .filter((email) => email && email.trim() !== '')
          ),
        ]}
      />
      <Table columns={'1.4fr 2fr .25fr 1.25fr .75fr .5fr .25fr 2.5fr  .2fr;'}>
        <Table.Header>
          <>
            <div>
              <input
                type="checkbox"
                checked={state.filteredPlayers.every((player) =>
                  playerEmails.some((play) => play.id === player.playerId)
                )}
                onChange={handleAllPlayerChecked}
              />
              <p>Players</p>
            </div>
            <div>Player</div>
            <HeaderSortFilter
              header={{
                label: 'Grade',
                name: 'grade',
                type: 'number',
                field: 'grade',
                table: 'playerSeasons',
              }}
              sort={{
                defaultSortDirection: true,
                handleSort: () => handleSort('grade'),
              }}
              filters={{}}
            />
            <HeaderSortFilter
              header={{
                name: 'created_at',
                label: 'Created',
                type: 'date',
                field: 'created_at',
                table: 'playerSeasons',
              }}
              sort={{
                defaultSortDirection: true,
                handleSort: () => handleSort('created_at'),
              }}
              filters={{}}
            />
            <div>
              Status
              <Select
                options={statusFilterLabel}
                type="white"
                onChange={(e) => handleFilterChange(+e.target.value)}
                value={statusFilter.value}
                width={15}
              />
            </div>
            <HeaderSortFilter
              header={{
                label: 'Team',
                field: 'teamLevel',
                table: 'playerSeasons',
              }}
              sort={{
                defaultSortDirection: true,
                handleSort: () => handleSort('team'),
              }}
              filters={{}}
            />
            <div>Returner</div>
            <div>
              <input
                type="checkbox"
                checked={state.filteredPlayers.every((player) =>
                  player.parents.every((parent) =>
                    parentEmails.some(
                      (selected) =>
                        selected.playerId === player.playerId &&
                        selected.id === parent.id
                    )
                  )
                )}
                onChange={handleAllParentsChecked}
              />
              <span>Parents</span>
            </div>
            <div></div>
          </>
        </Table.Header>
        <Table.Body
          data={sortedFilteredPlayers}
          render={(player) => {
            const playerChecked = playerEmails.some(
              (play) => play.id === player.playerId
            );
            const parentsChecked = player.parents.every((parent) =>
              parentEmails.some(
                (selected) =>
                  selected.playerId === player.playerId &&
                  selected.id === parent.id
              )
            );
            return (
              <CommunicationRow
                player={{ player }}
                key={player.id}
                onChangePlayer={handlePlayerChange}
                onChangeParent={handleParentChange}
                onChangeRow={handleRowClick}
                familyChecked={parentsChecked && playerChecked}
                parentsChecked={parentsChecked}
                playerChecked={playerChecked}
                parentEmails={parentEmails.filter(
                  (parent) => parent.playerId === player.playerId
                )}
              />
            );
          }}
        />
      </Table>
    </>
  );
}

export default CommunicationTable;
