import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
import CommunicationRow from './CommunicationRow';

import { usePlayers } from '../players/usePlayers';
import { usePlayerSeasons } from '../players/usePlayerSeasons';

import { useEffect, useRef, useState } from 'react';
import Button from '../../ui/Button';
import Table from '../../ui/Table';
import Empty from '../../ui/Empty';
import Menus from '../../ui/Menus';
import { useGetPlayerParents } from '../parents/useParents';
import { useSearchParams } from 'react-router-dom';
import { useSeason } from '../seasons/useSeasons';
import {
  statusFilterLabel,
  defaultVisiblePlayers,
  visibleRosterStatus,
  filterRosterStatus,
  defaultRosterStatus,
} from '../../utils/filterHelpers';
import FilterBy from '../../ui/FilterBy';
import Select from '../../ui/Select';

function CommunicationTable() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { isLoadingPlayerParents, playerParents } = useGetPlayerParents();
  const { isLoadingPlayerSeasons, playerSeasons } = usePlayerSeasons();
  const { isLoadingSeason, season } = useSeason();

  const [allPlayersChecked, setAllPlayersChecked] = useState('none');
  const [allParentsChecked, setAllParentsChecked] = useState('none');

  const [playerEmails, setPlayerEmails] = useState([]);
  const [parentEmails, setParentEmails] = useState([]);

  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [visibleStatus, setVisibleStatus] = useState('all');

  let statusFilter;
  useEffect(
    //on LOAD with a new object with needed fields
    function () {
      if (isLoadingPlayerParents || isLoadingPlayerSeasons || isLoadingSeason)
        return;
      const defaultPlayers = defaultVisiblePlayers(
        playerSeasons,
        playerParents,
        season
      );
      setFilteredPlayers(defaultPlayers);
    },
    [
      isLoadingPlayerParents,
      isLoadingPlayerSeasons,
      isLoadingSeason,
      playerParents,
      playerSeasons,

      season,
    ]
  );
  useEffect(
    //update emails when checked changes
    function () {
      if (isLoadingPlayerParents || isLoadingPlayerSeasons) return;
      const newPlayerFilter = filteredPlayers
        .filter((player) => player.isPlayerAdded && player.players.people.email)
        .map((player) => player.players.people.email);
      const newParentFilter = [
        ...new Set(
          filteredPlayers
            .map((player) =>
              player.parents.filter(
                (parent) => parent.parentEmail && parent.isParentAdded
              )
            )
            .flat(1)
            .map((email) => email.parentEmail)
        ),
      ];
      setPlayerEmails(newPlayerFilter);
      setParentEmails(newParentFilter);
    },
    [filteredPlayers, isLoadingPlayerParents, isLoadingPlayerSeasons]
  );

  if (isLoadingPlayerParents || isLoadingPlayerSeasons || isLoadingSeason)
    return <Spinner />;
  if (!playerParents.length) return <Empty resource="Player Parents" />;

  //handle filter changes

  statusFilter = searchParams.get('filterRosterStatus')
    ? statusFilterLabel.find(
        (status) => status.value === +searchParams.get('filterRosterStatus')
      )
    : defaultRosterStatus(season);

  function handleFilterChange(e) {
    searchParams.set(e.target.id, e.target.value);
    setSearchParams(searchParams);
    const visiblePlayers = visibleRosterStatus(
      filteredPlayers,
      statusFilterLabel.find((status) => status.value === +e.target.value)
    );
    setFilteredPlayers(visiblePlayers);
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
    //todo I AM HERE add visible parents only to check all
    const addAll = filteredPlayers.map((player) => {
      return {
        ...player,
        parents: player.parents.map((parent) => {
          return { ...parent, isParentAdded: e.target.checked };
        }),
      };
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
      //todo move this to the UseEffect
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
  //TODO Add filter
  //TODO update the season filter

  return (
    <>
      <Menus>
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
              <div>
                Status
                <Select
                  options={statusFilterLabel}
                  type="white"
                  onChange={handleFilterChange}
                  value={statusFilter.value}
                  id={'filterRosterStatus'}
                ></Select>
                {/* <FilterBy
                  options={statusFilterLabel}
                  id={'filterRosterStatus'}
                  default={statusFilter.value}
                /> */}
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
            data={filteredPlayers}
            render={(player) =>
              player.isPlayerVisible ? (
                <CommunicationRow
                  player={{ player }}
                  key={player.id}
                  onChangePlayer={handlePlayerChange}
                  onChangeParent={handleParentChange}
                  onChangeRow={handleRowClick}
                />
              ) : null
            }
          />
        </Table>
      </Menus>
    </>
  );
}

export default CommunicationTable;
