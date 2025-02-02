import Spinner from '../../ui/Spinner';
import CommunicationRow from './CommunicationRow';

import { useEffect, useMemo, useState } from 'react';
import Table from '../../ui/Table';
import Empty from '../../ui/Empty';

import { useSearchParams } from 'react-router-dom';
import {
  statusFilterLabel,
  defaultRosterStatus,
} from '../../utils/filterHelpers';
// import FilterBy from '../../ui/FilterBy';
import Select from '../../ui/Select';
import HeaderSortFilter from '../../ui/HeaderSortFilter';
import { convertSBdateToLocalDate } from '../../utils/helpers';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import { useData } from '../../services/useUniversal';

function CommunicationTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentSeason } = useCurrentSeason();
  const season = currentSeason.id;

  const [allPlayersChecked, setAllPlayersChecked] = useState('none');
  const [allParentsChecked, setAllParentsChecked] = useState('none');

  const [playerEmails, setPlayerEmails] = useState([]);
  const [parentEmails, setParentEmails] = useState([]);

  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [statusFilter, setStatusFilter] = useState({});
  // let statusFilter;

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

  useEffect(
    //on LOAD with a new object with needed fields
    function () {
      if (isLoadingPlayerSeasons || isLoadingPlayerParents) return;
      const allPlayerParents = playerSeasons.map((player) => ({
        ...player,
        parents: playerParents.filter(
          (parent) => parent.player === player.playerId
        ),
      }));
      setPlayers(allPlayerParents);
    },
    [
      isLoadingPlayerParents,
      isLoadingPlayerSeasons,
      playerParents,
      playerSeasons,
    ]
  );
  useEffect(() => {
    //set filter on load
    const defaultFilter = defaultRosterStatus(currentSeason);

    handleFilterChange(defaultFilter);
  }, [currentSeason, players]);
  // useEffect(
  //   //update emails when checked changes
  //   function () {
  //     if (isLoadingPlayerParents || isLoadingPlayerSeasons) return;
  //     const newPlayerFilter = filteredPlayers.players
  //       .filter((player) => player.isPlayerAdded && player.email)
  //       .map((player) => player.email);
  //     const newParentFilter = [
  //       ...new Set(
  //         filteredPlayers.players
  //           .map((player) =>
  //             player.parents.filter(
  //               (parent) => parent.parentEmail && parent.isParentAdded
  //             )
  //           )
  //           .flat(1)
  //           .map((email) => email.parentEmail)
  //       ),
  //     ];
  //     setPlayerEmails(newPlayerFilter);
  //     setParentEmails(newParentFilter);
  //   },
  //   [filteredPlayers, isLoadingPlayerParents, isLoadingPlayerSeasons]
  // );

  // function handleFilterChange(e) {
  //   searchParams.set(e.target.id, e.target.value);
  //   setSearchParams(searchParams);

  //   +e.target.value === 0
  //     ? setFilteredPlayers(players)
  //     : setFilteredPlayers(
  //         players.filter(
  //           (player) =>
  //             player.status ===
  //             statusFilterLabel.find(
  //               (status) => status.value === +e.target.value
  //             ).label
  //         )
  //       );

  //   // const visiblePlayers = visibleRosterStatus(
  //   //   filteredPlayers,
  //   //   statusFilterLabel.find((status) => status.value === +e.target.value)
  //   // );
  //   // setFilteredPlayers(visiblePlayers);
  // }
  function handleFilterChange(value) {
    //update searchParams
    //update state
    //update players
    setFilteredPlayers(
      players.filter((player) => player.status === value.label)
    );
    console.log(
      statusFilterLabel.find(
        (status) => status.value === +searchParams.get('filterRosterStatus')
      )
    );
    const g = searchParams.get('filterRosterStatus')
      ? statusFilterLabel.find(
          (status) => status.value === +searchParams.get('filterRosterStatus')
        )
      : defaultRosterStatus(season);
    console.log(g);
    setStatusFilter(g);
  }
  function handleAllPlayerChecked(e) {
    //update all checks
    setAllPlayersChecked(e.target.checked ? 'all' : 'none');
    const addAll = filteredPlayers.map((player) => {
      if (player.isPlayerVisible) {
        return { ...player, isPlayerAdded: e.target.checked };
      } else return { ...player };
    });
    // if (!e.target.checked) setPlayerEmails([]);
    setFilteredPlayers(addAll);
  }
  function handleAllParentsChecked(e) {
    setAllParentsChecked(e.target.checked ? 'all' : 'none');
    //change parent isParentAdded to e.target.checked
    const addAll = filteredPlayers.map((player) => {
      if (player.isPlayerVisible) {
        return {
          ...player,
          parents: player.parents.map((parent) => {
            return { ...parent, isParentAdded: e.target.checked };
          }),
        };
      } else {
        return { ...player };
      }
    });
    setFilteredPlayers(addAll);
  }
  function handlePlayerChange({ checked, email, playerId }) {
    if (allPlayersChecked === 'all') {
      // if all is checked, and the checked is true, return (we don't need to do anything)
      if (checked) return;
      // if all is checked, and the checked is false, set allPlayersChecked to some and remove email
      else {
        setAllPlayersChecked('some');
        updateEmailStatus(checked);
      }
    }
    if (allPlayersChecked === 'some') {
      //if some is checked and the chedked is true, add email , then check to see if all are chedked
      if (checked) {
        updateEmailStatus(checked);
        //if some is chedked and the chcked is false, remove email
      } else updateEmailStatus(checked);
    }
    if (allPlayersChecked === 'none') {
      // if none is chedked and the checked is true, set allPlayersChecked to some and add email
      if (checked) {
        setAllPlayersChecked('some');
        updateEmailStatus(checked);
        //if none and checked is false, return (we don't need to do anything)
      } else return;
    }
    function updateEmailStatus(checked) {
      const newFilter = //change object to don't show
        filteredPlayers.map((player) => {
          if (player.playerId === playerId) {
            return { ...player, isPlayerAdded: checked };
          } else return player;
        });
      setFilteredPlayers(newFilter);
      if (checked) checkForAll(newFilter);
    }
    function checkForAll(newFilter) {
      ///if all players are clicked, checkall button
      if (!newFilter.some((player) => player.isPlayerAdded === false))
        setAllPlayersChecked('all');
    }
  }
  function handleParentChange({ checked, email, playerId, parentId }) {
    // setAllParentsChecked to true
    //allParents Checked = 'all'
    if (allParentsChecked === 'all') {
      //checked = true
      if (checked) return;
      //checked = false
      // setAllParentsChecked to false
      setAllParentsChecked('some');
      updateEmails();
    }
    //allParents Checked = 'some'
    if (allParentsChecked === 'some') {
      if (checked)
        //checked = true
        updateEmails(); //checked = false
      else updateEmails();
    }
    //allParents Checked = 'none'
    if (allParentsChecked === 'none') {
      if (!checked)
        //checked = false
        return;
      //checked = true
      setAllParentsChecked('some');
      updateEmails();
    }
    function updateEmails() {
      //update object
      const [addNew] = filteredPlayers
        .filter((player) => player.playerId === playerId)
        .map((player) => {
          return {
            ...player,
            parents: player.parents.map((parent) => {
              if (parent.parentId === parentId) {
                return { ...parent, isParentAdded: checked };
              } else return parent;
            }),
          };
        });
      const newFilter = filteredPlayers.map((player) => {
        if (player.playerId === playerId) {
          return addNew;
        } else return player;
      });
      checkForAll(newFilter);
      setFilteredPlayers(newFilter);
    }
    function checkForAll(newFilter) {
      ///if all parents are clicked, checkall button
      if (
        !newFilter.some((player) =>
          player.parents.some((parent) => parent.isParentAdded === false)
        )
      )
        setAllParentsChecked('all');
    }
  }
  function handleRowClick(e, row) {
    let rowCheck = filteredPlayers.map((player) => {
      if (player.playerId === row.player.playerId) {
        return {
          ...player,
          parents: player.parents.map((parent) => {
            return { ...parent, isParentAdded: e.target.checked };
          }),
        };
      } else return player;
    });
    if (e.target.id === 'familyCheck') {
      rowCheck = rowCheck.map((player) => {
        if (player.playerId === row.player.playerId) {
          return { ...player, isPlayerAdded: e.target.checked };
        } else return player;
      });
    }
    if (!e.target.checked) {
      setAllParentsChecked('some');
      if (e.target.id === 'familyCheck') setAllPlayersChecked('some');
    }

    setFilteredPlayers(rowCheck);
  }
  function handleSort(selectedSort) {}

  if (isLoadingPlayerParents || isLoadingPlayerSeasons || !players?.length)
    return <Spinner />;
  if (!playerParents.length) return <Empty resource="Player Parents" />;

  //handle filter changes

  return (
    <>
      <input defaultValue={playerEmails} />
      <input defaultValue={parentEmails} />
      <Table columns={'1.4fr 2fr .25fr 1fr 1fr .25fr 2.5fr  .2fr;'}>
        <Table.Header>
          <>
            <div>
              <input
                type="checkbox"
                checked={allPlayersChecked === 'all'}
                onChange={handleAllPlayerChecked}
              />
              <p>Players</p>
            </div>
            <div>Player</div>
            <div>Grade</div>
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
                handleSort: handleSort,
              }}
              filters={{}}
            />
            <div>
              Status
              <Select
                options={statusFilterLabel}
                type="white"
                onChange={handleFilterChange}
                value={statusFilter.value}
              />
            </div>
            <div>Team</div>
            <div>Returner</div>
            <div>
              <input
                type="checkbox"
                checked={allParentsChecked === 'all'}
                onChange={handleAllParentsChecked}
              />
              <span>Parents</span>
            </div>
            <div></div>
          </>
        </Table.Header>
        <Table.Body
          data={filteredPlayers
            .sort((a, b) => {
              const aa = a.firstName.toLowerCase();
              const bb = b.firstName.toLowerCase();
              if (aa < bb) {
                return -1;
              }
              if (aa > bb) {
                return 1;
              }
              return 0;
            })
            .sort((a, b) => {
              const aa = a.lastName.toLowerCase();
              const bb = b.lastName.toLowerCase();
              if (aa < bb) {
                return -1;
              }
              if (aa > bb) {
                return 1;
              }
              return 0;
            })
            .sort((a, b) => b.grade - a.grade)
            .sort(
              (a, b) =>
                new Date(convertSBdateToLocalDate(b.created_at)) -
                new Date(convertSBdateToLocalDate(a.created_at))
            )}
          render={(player) => (
            // player.isPlayerVisible ? (
            <CommunicationRow
              player={{ player }}
              key={player.id}
              onChangePlayer={handlePlayerChange}
              onChangeParent={handleParentChange}
              onChangeRow={handleRowClick}
            />
          )}
        />
      </Table>
    </>
  );
}

export default CommunicationTable;
