// External libraries
import { useState } from 'react';
import styled from 'styled-components';

// Utility functions
import { getCurrentTime } from '../../../utils/helpers';

// Contexts
import { useGameContext } from '../../../contexts/GameContext';
import { usePlayerContext } from '../../../contexts/PlayerContext';

// Components
import Button from '../../../ui/Button';
import Substitutions from './duringGame/Substitutions';
import PlayerTable from './components/PlayerTable';
import PopUpConfirm from './modalGames/PopUpConfirm';
import ModalGamesEditButton from './modalGamesEdit/ModalGamesEditButton';
import { useSubstitutionHandling } from '../../../hooks/useSubstitutionHandling';

const Container = styled.div`
  display: flex;
  flex: 1;
  gap: 1rem;
  overflow: hidden;
  margin: 1rem;
`;
const Column = styled.div`
  width: 50%;
  flex: 1;
  overflow-y: auto;
  margin: 1rem;
`;

function GamePeriodBreak() {
  const { subsInWaiting, setSubsInWaiting, gameSubs, setGameSubs } =
    usePlayerContext(); // Access player context states

  const { periodHandle, gameData, getGameTime } = useGameContext(); // Access currentPeriod and gameMinute

  const [openModal, setOpenModal] = useState(null); // Tracks the active modal
  const [startTime, setStartTime] = useState(null); // Tracks the active modal
  const { currentPeriod } = gameData; // Access currentPeriod and gameMinute
  const gameMinute = getGameTime.gameTime();

  const { enterAllSubs } = useSubstitutionHandling({
    subsInWaiting,
    setSubsInWaiting,
    gameSubs,
    setGameSubs,
  });

  function handleClick() {
    const start = getCurrentTime();

    setStartTime(() => start);
    if (subsInWaiting.length > 1) setOpenModal(true);
    else startPeriod(start);
  }
  function handleModalAction(id, actionType) {
    // Handle actions based on modal id and button action
    handleCloseModal();
    if (id === 'subsConfirm' && actionType === 'confirmBtn')
      enterAllSubs({ periodId: currentPeriod.id, gameMinute }); // Pass currentPeriod ID and gameMinute
    startPeriod();
  }
  function handleCloseModal() {
    setOpenModal(null); // Close any open modal
  }
  function startPeriod(start) {
    periodHandle.startPeriod({ start: startTime || start });
  }

  return (
    <>
      {openModal && (
        <PopUpConfirm
          id="subsConfirm"
          title="Confirm Substitutions"
          message="Do you want to enter subs on Period Start?"
          buttonType="YesNo"
          onClose={handleCloseModal}
          onAction={handleModalAction}
        />
      )}
      <ModalGamesEditButton />
      <Button onClick={handleClick}>START Next Period</Button>
      <Container>
        <Column>
          <Substitutions />
        </Column>
        <Column>
          <PlayerTable
            status={'break'}
            sortArr={[
              { field: 'number', order: 'asc' },
              { field: 'minPlayed', order: 'dec' },
            ]}
          />
        </Column>
      </Container>
    </>
  );
}

export default GamePeriodBreak;
