import { NavLink } from 'react-router-dom';

import Button from '../../../ui/Button';

import { useState } from 'react';

import styled from 'styled-components';
import OnFieldPlayers from './duringGame/OnFieldPlayers';
import OffFieldPlayers from './duringGame/OffFieldPlayers';
import ActionButtons from './duringGame/ActionButtons';
import Substitutions from './duringGame/Substitutions';

import Heading from '../../../ui/Heading';

import { useGameContext } from '../../../contexts/GameContext';
import { usePlayerContext } from '../../../contexts/PlayerContext';
import {
  useCreateData,
  useDeleteData,
  useUpdateData,
} from '../../../services/useUniversal';

const Container = styled.div`
  max-height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
`;
const Grid = styled.div`
  flex: 0 0 100%;
  display: grid;
  grid-template-rows: 15.9rem 0.7fr 0.25fr;
  align-items: stretch;
`;
const Div = styled.div`
  justify-content: center;
  padding: 1rem 0;
  display: flex;
  overflow: auto;
`;
const Row = styled.div`
  grid-column: 1 / -1;
`;

function GameDuring({ updateStates, endPeriod }) {
  const { game, getGameTime, subs, currentPeriod } = useGameContext();
  const { activePlayers } = usePlayerContext();

  const { isCreating, createData } = useCreateData();
  const { isUpdating, updateData } = useUpdateData();
  const { isDeleting, deleteData } = useDeleteData();
  const [currentPlayers, setCurrentPlayers] = useState(
    setCurrentPlayerStatus()
  );
  const [subsInWaiting, setSubsInWaiting] = useState([
    ...subs.filter((sub) => !sub.gameMinute),
    { id: null, subIn: null, subOut: null },
  ]);

  function setCurrentPlayerStatus() {
    return {
      onField: activePlayers
        .filter((player) => player.subStatus === 1)
        .sort((a, b) => a.number - b.number),
      offField: activePlayers
        .filter((player) => player.subStatus === 0)
        .sort((a, b) => a.number - b.number),
    };
  }
  function handleSubChange(e) {
    //updates a line of subs with new player out or new player in
    //it gets the type and index of the player selected
    const [type, index] = e.target.name.split('-');
    const player = +e.target.value;
    const storedSub = subsInWaiting.find((sub, idx) => idx === +index);
    const updatedSub = { ...storedSub, [type]: player };
    const newSubs = subsInWaiting.map((sub, idx) =>
      idx !== +index ? { ...sub } : { ...updatedSub }
    );
    //if new sub line
    if (!storedSub.id)
      createData(
        {
          table: 'subs',
          newData: {
            periodId: currentPeriod.id,
            [type]: player,
            game: game.id,
          },
          toast: false,
        },
        {
          onSuccess: (data) => {
            // based on subIn or Out will determine which index is changed
            const updatedSubs = newSubs.map((sub, idx) =>
              idx !== +index ? { ...sub } : { ...data.data[0] }
            );
            handleNewSubsInWaiting(updatedSubs);
          },
        }
      );
    else {
      updateData({
        table: 'subs',
        newData: { ...updatedSub },
        id: storedSub.id,
      });
      handleNewSubsInWaiting(newSubs);
    }
  }
  function enterAllSubs() {
    const gameTime = getGameTime();
    //todo don't enter if missing an in or out
    if (
      subsInWaiting.some(
        (sub) => (!sub.subIn && sub.subOut) || (sub.subIn && !sub.subOut)
      )
    )
      return;
    subsInWaiting.map((sub) => {
      if (sub.subIn && sub.subOut) {
        updateCurrentPlayers(sub, gameTime);
        updateData({
          table: 'subs',
          newData: { gameMinute: gameTime },
          id: sub.id,
        });
      } else if (!sub.subIn && !sub.subOut)
        setSubsInWaiting([{ id: null, subIn: null, subOut: null }]);
      else return;
    });
  }
  function handleBtnClick(e) {
    //handles a delete or enter of a single line of subs
    const [type, index] = e.target.closest('button').name.split('-');
    const clickedSub = subsInWaiting.find((sub, idx) => +index === idx);
    const newSubs = subsInWaiting.filter((sub, idx) => +index !== idx);
    const gameTime = getGameTime();

    if (type === 'enter') {
      if (!clickedSub.subIn || !clickedSub.subOut) return;
      updateCurrentPlayers(clickedSub, gameTime);
      updateData({
        table: 'subs',
        newData: { gameMinute: gameTime },
        id: clickedSub.id,
      });
    }
    if (type === 'delete') {
      deleteData({ table: 'subs', id: clickedSub.id, toast: false });
    }
    handleNewSubsInWaiting(newSubs);
  }
  function handleNewSubsInWaiting(newSubs) {
    //updates the subs in waiting by either removing(deleting/entering), or creating a line

    const numberOfSubs = Math.min(
      currentPlayers.onField.length,
      currentPlayers.offField.length
    );
    // a new line will be added if there are still players on the field who have not subbed out or players on the bench to sub in
    const newSubsInWaiting =
      newSubs.filter((sub) => !sub.subOut && !sub.subIn).length === 0 &&
      numberOfSubs > newSubs.length
        ? [...newSubs, { id: null, subIn: null, subOut: null }]
        : [...newSubs];
    setSubsInWaiting(newSubsInWaiting);
  }
  function updateCurrentPlayers({ subIn, subOut }, gameTime) {
    //create a function for entering a sub
    //1change their onField or offField Status
    //2change substatus to either 0 or 1
    //3change either ins or outs to increase by one
    const [subbedOut] = currentPlayers.onField
      .filter((player) => player.playerId === subOut)
      .map((player) => ({
        ...player,
        subStatus: 0,
        outs: player.outs + 1,
        outMinutes: player.outMinutes + gameTime,
        minPlayed: gameTime - (player.outMinutes - player.inMinutes),
        lastOut: gameTime,
        subOuts: [...player.subOuts, gameTime],
      }));
    const [subbedIn] = currentPlayers.offField
      .filter((player) => player.playerId === subIn)
      .map((player) => ({
        ...player,
        subStatus: 1,
        ins: player.ins + 1,
        inMinutes: player.inMinutes - gameTime,
        minPlayed: player.outMinutes - player.inMinutes,
        lastIn: gameTime,
        subIns: [...player.subIns, gameTime],
      }));

    setCurrentPlayers((cur) => ({
      offField: [
        ...cur.offField.filter((player) => player.playerId !== subIn),
        subbedOut,
      ].sort((a, b) => a.number - b.number),

      onField: [
        ...cur.onField.filter((player) => player.playerId !== subOut),
        subbedIn,
      ].sort((a, b) => a.number - b.number),
    }));
  }

  return (
    <>
      <div>
        <NavLink to={`./?gameId=${game.id}&edit=true`}>
          <Button
            name="manualGame"
            // disabled={isEditingGame}
            variation="secondary"
          >
            Edit Stats
          </Button>
        </NavLink>
        <Button name="endPeriod" onClick={endPeriod} variation="primary">
          End period
        </Button>
      </div>

      <Container>
        <Grid>
          <Row>
            <ActionButtons updateStates={updateStates} />
          </Row>
          <Div>
            <div>
              <Heading as="h2" case="upper" location="center">
                PLAYERS ON THE FIELD
              </Heading>
              <OnFieldPlayers players={currentPlayers.onField} />
            </div>
            <div>
              <Heading as="h2" case="upper" location="center">
                PLAYERS ON THE BENCH
              </Heading>
              <OffFieldPlayers players={currentPlayers.offField} />
            </div>
          </Div>
          <Div>
            <Substitutions
              players={currentPlayers}
              subsInWaiting={subsInWaiting}
              handleSubChange={handleSubChange}
              handleBtnClick={handleBtnClick}
              enterAllSubs={enterAllSubs}
              isWorking={isCreating}
            />
          </Div>
        </Grid>
      </Container>
    </>
  );
}

export default GameDuring;
