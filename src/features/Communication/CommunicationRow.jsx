import styled from 'styled-components';
// import { useState } from 'react';

import { HiSquare2Stack, HiPencil, HiTrash } from 'react-icons/hi2';

import Modal from '../../ui/Modal';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

const Player = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;
const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;
function CommunicationRow({ player, parents }) {
  //   const [showForm, setShowForm] = useState(false);
  const { allPlayersChecked } = player;
  const { allParentsChecked } = parents;
  const { parent } = parents;
  const [playerEmails, setPlayerEmails] = useState([]);
  const [parentEmails, setParentEmails] = useState([]);
  const {
    player: {
      playerId,
      grade,
      status,
      teamLevel,
      returningPlayer,
      players: {
        people: { firstName, lastName, email },
      },
    },
  } = player;
  const [playerRowChecked, setPlayerRowChecked] = useState(allPlayersChecked);
  const [parentChecked, setParentChecked] = useState(allPlayersChecked);

  useEffect(
    function () {
      setPlayerRowChecked(allPlayersChecked);
    },
    [allPlayersChecked]
  );
  useEffect(
    function () {
      setParentChecked(allParentsChecked);
    },
    [allParentsChecked]
  );

  function handlePlayerRowCheck(e) {
    setPlayerRowChecked(e.target.checked);
    if (e.target.checked)
      setPlayerEmails([...playerEmails, e.target.closest.id]);
    else
      setPlayerEmails(
        playerEmails.filter((email) => email !== e.target.closest.id)
      );
    console.log(playerEmails);
  }
  function handleParentCheck(e) {
    setParentChecked(e.target.checked);
  }
  return (
    <Table.Row id={email}>
      <div>
        <input
          type="checkbox"
          checked={playerRowChecked}
          onChange={handlePlayerRowCheck}
        />
      </div>
      <Player>{`${firstName} ${lastName}`}</Player>
      <div>{grade}</div>
      <div>{status}</div>
      <div>{teamLevel}</div>
      <div>{returningPlayer ? 'Yes' : 'No'}</div>
      <div>
        {parent.map((parent) => (
          <Flex key={parent.parent}>
            <div>
              {`${parent.parents.people.firstName} ${parent.parents.people.lastName}`}
            </div>
            <input
              type="checkbox"
              checked={parentChecked}
              // TODO FIX ME this changes all parents for the player, not just the one that we click
              onChange={handleParentCheck}
            />
          </Flex>
        ))}
      </div>
      <div></div>
    </Table.Row>
  );
}

export default CommunicationRow;
