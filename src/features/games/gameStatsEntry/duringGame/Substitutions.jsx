import styled from 'styled-components';
import Select from '../../../../ui/Select';

import ButtonIcon from '../../../../ui/ButtonIcon';
import { HiTrash } from 'react-icons/hi2';
import { CgEnter } from 'react-icons/cg';
import {
  useCreateData,
  useDeleteData,
  useUpdateData,
} from '../../../../services/useUniversal';
import { useGameContext } from '../../../../contexts/GameContext';

import { usePlayerContext } from '../../../../contexts/PlayerContext';

const Container2 = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;
const Container = styled.div``;
const Div = styled.div`
  display: flex;
  margin: 0.5rem auto;
`;
const Div2 = styled.div`
  display: flex;
  justify-content: space-around;
`;
const Div3 = styled.div`
  width: 75%;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  margin-top: 2rem;
  text-align: center;
`;
function Substitutions({ isWorking, children }) {
  const { gameDetails, getGameTime, currentPeriod, gameStatus } =
    useGameContext();
  const { game } = gameDetails;
  const { isCreating, createData } = useCreateData();
  const { isUpdating, updateData } = useUpdateData();
  const { isDeleting, deleteData } = useDeleteData();

  const {
    currentPlayers,
    subsInWaiting,
    setSubsInWaiting,
    updateCurrentPlayers,
  } = usePlayerContext();

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
    setSubsInWaiting(() => newSubsInWaiting);
  }

  return (
    <Container2>
      <Container>
        {subsInWaiting.map((subs, index) => (
          <Div key={`${index}-sub`}>
            <Select
              width={25}
              options={[
                //then the value of the player that is selected if there is one
                !subs.subOut //the options first add blank label
                  ? { value: 'out', label: 'SUBBING OUT' }
                  : {
                      value: currentPlayers.onField.find(
                        (player) => +subs.subOut === player.playerId
                      )?.playerId,
                      label: currentPlayers.onField.find(
                        (player) => +subs.subOut === player.playerId
                      )?.fullname,
                    }, //then only the players who are not already being subbed out
                ...currentPlayers.onField
                  .filter(
                    (player) =>
                      !subsInWaiting.some(
                        (sub) => sub.subOut === player.playerId
                      )
                  )
                  .map((player) => ({
                    value: player.playerId,
                    label: player.fullname,
                  })),
              ]}
              onChange={handleSubChange}
              name={`subOut-${index}`}
              value={
                subs.subOut
                  ? currentPlayers.onField.find(
                      (player) => +subs.subOut === player.playerId
                    )?.playerId
                  : 'out'
              }
            />
            <Select
              width={25}
              options={[
                //then the value of the player that is selected if there is one
                !subs.subIn //the options first add blank label
                  ? { value: 'in', label: 'SUBBING IN' }
                  : {
                      value: currentPlayers.offField.find(
                        (player) => +subs.subIn === player.playerId
                      )?.playerId,
                      label: currentPlayers.offField.find(
                        (player) => +subs.subIn === player.playerId
                      )?.fullname,
                    }, //then only the players who are not already being subbed in
                ...currentPlayers.offField
                  .filter(
                    (player) =>
                      !subsInWaiting.some(
                        (sub) => sub.subIn === player.playerId
                      )
                  )
                  .map((player) => ({
                    value: player.playerId,
                    label: player.fullname,
                  })),
              ]}
              onChange={handleSubChange}
              name={`subIn-${index}`}
              value={
                subs.subIn
                  ? currentPlayers.offField.find(
                      (player) => +subs.subIn === player.playerId
                    )?.playerId
                  : 'in'
              }
            />
            {(subs.subIn || subs.subOut) && (
              <Div2>
                <ButtonIcon
                  name={`delete-${index}`}
                  disabled={isWorking}
                  onClick={handleBtnClick}
                >
                  <HiTrash style={{ color: 'red' }} />
                </ButtonIcon>
                <ButtonIcon
                  name={`enter-${index}`}
                  disabled={isWorking}
                  onClick={handleBtnClick}
                >
                  <CgEnter style={{ color: 'green' }} />
                </ButtonIcon>
              </Div2>
            )}
          </Div>
        ))}
      </Container>
      <Div3>
        {(subsInWaiting.length > 1 || gameStatus === 'betweenPeriods') && (
          <div>
            {!subsInWaiting.some(
              (sub) => (!sub.subIn && sub.subOut) || (sub.subIn && !sub.subOut)
            ) ? (
              <div>{children}</div>
            ) : (
              <h2>Each Line Must have a sub in and sub out</h2>
            )}
          </div>
        )}
      </Div3>
    </Container2>
  );
}

export default Substitutions;
