import styled from 'styled-components';
import Select from '../../../../ui/Select';
import ButtonIcon from '../../../../ui/ButtonIcon';
import { HiTrash } from 'react-icons/hi2';
import { CgEnter } from 'react-icons/cg';

import { useGameContext } from '../../../../contexts/GameContext';
import { usePlayerContext } from '../../../../contexts/PlayerContext';

import { useSubstitutionHandling } from '../../../../hooks/useSubstitutionHandling';

// Styled components for layout and styling
const Main = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ButtonArea = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Div = styled.div`
  display: flex;
  margin: 0.5rem auto;
`;
const Div2 = styled.div`
  display: flex;
  justify-content: space-around;
`;

function Substitutions({ isWorking, children }) {
  const { gameData, gameDataArrays, getGameTime } = useGameContext();
  const { currentPeriod, gameProgress } = gameData;
  const { game } = gameDataArrays;

  const {
    currentPlayers,
    updateCurrentPlayers,
    subsInWaiting,
    setSubsInWaiting,
    setGameSubs,
  } = usePlayerContext();
  const { createSub, updateSub, deleteSub, enterSub } = useSubstitutionHandling(
    {
      subsInWaiting,
      setSubsInWaiting,
      updateCurrentPlayers,

      setGameSubs,
    }
  );
  //TODO add rosternumber and sort by roster on select fields
  /**
   * Handles changes to substitution selections (player in/out).
   * Updates the state and optionally creates/updates data in the database.
   * @param {Event} e - Change event from the Select component.
   */
  async function handleSubChange({ player, type, index }) {
    try {
      const storedSub = subsInWaiting[+index];
      if (!storedSub) throw new Error('Substitution data not found.');
      if (!storedSub.id)
        createSub({
          periodId: currentPeriod.id,
          type,
          player,
          game: game.id,
        });
      else {
        const updatedSub = { ...storedSub, [type]: player };
        updateSub({ updatedSub });
      }
    } catch (error) {
      console.error('Error handling substitution change:', error);
    }
  }

  /**
   * Handles button actions (delete or confirm substitution).
   * @param {Event} e - Click event from the button.
   */
  async function handleBtnClick({ type, index }) {
    try {
      const clickedSub = subsInWaiting[+index];
      if (!clickedSub) throw new Error('Substitution data not found.');
      if (type === 'delete') deleteSub(index);
      else if (type === 'enter') {
        if (!clickedSub.subIn || !clickedSub.subOut) return;
        const gameTime = getGameTime.gameTime();
        enterSub(index, clickedSub, gameTime);
      }
    } catch (error) {
      console.error('Error handling button click:', error);
    }
  }

  return (
    <>
      <Main>
        {subsInWaiting.map((subs, index) => (
          <Div key={subs.id || `${index}-sub`}>
            <Select
              width={25}
              options={[
                !subs.subOut
                  ? { value: 'out', label: 'SUBBING OUT' }
                  : {
                      value: subs.subOut,
                      label:
                        currentPlayers.onField.find(
                          (player) => player.playerid === subs.subOut
                        )?.fullname || 'Unknown Player',
                    },
                ...currentPlayers.onField
                  .filter(
                    (player) =>
                      !subsInWaiting.some(
                        (sub) => sub.subOut === player.playerid
                      )
                  )
                  .map((player) => ({
                    value: player.playerid,
                    label: player.fullname,
                  })),
              ]}
              onChange={(e) =>
                handleSubChange({
                  player: +e.target.value,
                  type: 'subOut',
                  index,
                })
              }
              name={`subOut-${index}`}
              value={subs.subOut || 'out'}
            />
            <Select
              width={25}
              options={[
                !subs.subIn
                  ? { value: 'in', label: 'SUBBING IN' }
                  : {
                      value: subs.subIn,
                      label:
                        currentPlayers.offField.find(
                          (player) => player.playerid === subs.subIn
                        )?.fullname || 'Unknown Player',
                    },
                ...currentPlayers.offField
                  .filter(
                    (player) =>
                      !subsInWaiting.some(
                        (sub) => sub.subIn === player.playerid
                      )
                  )
                  .map((player) => ({
                    value: player.playerid,
                    label: player.fullname,
                  })),
              ]}
              onChange={(e) =>
                handleSubChange({
                  player: +e.target.value,
                  type: 'subIn',
                  index,
                })
              }
              name={`subIn-${index}`}
              value={subs.subIn || 'in'}
            />
            {(subs.subIn || subs.subOut) && (
              <Div2>
                <ButtonIcon
                  name={`delete-${index}`}
                  disabled={isWorking}
                  onClick={() => handleBtnClick({ type: 'delete', index })}
                >
                  <HiTrash style={{ color: 'red' }} />
                </ButtonIcon>
                {gameProgress !== 'betweenPeriods' && (
                  <ButtonIcon
                    name={`enter-${index}`}
                    disabled={isWorking}
                    onClick={() => handleBtnClick({ type: 'enter', index })}
                  >
                    <CgEnter style={{ color: 'green' }} />
                  </ButtonIcon>
                )}
              </Div2>
            )}
          </Div>
        ))}
      </Main>
      <div>
        {(subsInWaiting.length > 1 || gameProgress === 'betweenPeriods') && (
          <ButtonArea>
            {!subsInWaiting.some(
              (sub) => (!sub.subIn && sub.subOut) || (sub.subIn && !sub.subOut)
            ) ? (
              children
            ) : (
              <h2>Each Line Must have a sub in and sub out</h2>
            )}
          </ButtonArea>
        )}
      </div>
    </>
  );
}

export default Substitutions;
