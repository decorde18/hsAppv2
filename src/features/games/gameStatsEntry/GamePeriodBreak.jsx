import styled from 'styled-components';
import Button from '../../../ui/Button';
import Substitutions from './duringGame/Substitutions';
import PlayerTable from './components/PlayerTable';
import { useGameContext } from '../../../contexts/GameContext';
import { usePlayerContext } from '../../../contexts/PlayerContext';
import PopUpConfirm from './modalGames/PopUpConfirm';
import { useState } from 'react';
import { getCurrentTime } from '../../../utils/helpers';
import ModalGamesEditButton from './modalGamesEdit/ModalGamesEditButton';
const popUpOptions = [
  {
    title: 'Confirm Subs Entry',
    message: 'Do you want to enter all subs from waiting subs?',
    confirmType: 'subsConfirmed',
    btnTypes: 'YesNo',
  },
];
const SplitSection = styled.div`
  display: flex;
  flex: 1;
  gap: 1rem;
  overflow-y: auto;
`;
const Section = styled.div`
  width: 50%;
`;

function GamePeriodBreak() {
  const { subsInWaiting, enterAllSubs } = usePlayerContext();
  const [popUpOpen, setPopUpOpen] = useState(false);
  const { updateGame, periodHandle } = useGameContext();

  let start;
  //todo- thi popUpOptions ia already in ModalStoppages
  start = getCurrentTime();
  function handleClick() {
    periodHandle.startPeriod({ start });
    // subs in waiting - enter prompt
    if (subsInWaiting.length > 1) setPopUpOpen(true);
  }
  function closePopUp(e) {
    //todo fixme enter sub takes old period, not new
    const btn = e.target.name.split('-')[0];
    setPopUpOpen((val) => !val);
    //todo use start for enterAllSubs
    if (btn === 'confirmBtn') enterAllSubs();
  }
  //todo player times should not keep trying to update from PlayerTableRow during a break (and probably a stoppage that is stopped as well)
  return (
    <>
      {popUpOpen && (
        <PopUpConfirm
          title="Enter Subs"
          message="Do you want to enter subs on Period Start?"
          confirmType="enterSubs"
          onClose={closePopUp}
          btnTypes="YesNo"
        />
      )}
      <ModalGamesEditButton />
      <Button onClick={handleClick}>START Next Period</Button>
      <SplitSection>
        <Section>
          <Substitutions />
        </Section>
        <Section>
          <PlayerTable
            status={'break'}
            sortArr={[
              { field: 'number', order: 'asc' },
              { field: 'minPlayed', order: 'dec' },
            ]}
          />
        </Section>
      </SplitSection>
    </>
  );
}

export default GamePeriodBreak;
