import styled from 'styled-components';

import { useGameContext } from '../../../../contexts/GameContext';

import Heading from '../../../../ui/Heading';

import ActionGoal from '../duringGame/ActionGoal';
import ActionDiscipline from '../duringGame/ActionDiscipline';
import ActionInjury from '../duringGame/ActionInjury';
import ActionOther from '../duringGame/ActionOther';
import ModalStoppagesNav from './ModalStoppagesNav';
import { usePlayerContext } from '../../../../contexts/PlayerContext';
import Substitutions from '../duringGame/Substitutions';
import PopUpConfirm from './PopUpConfirm';
import { useState } from 'react';
import Button from '../../../../ui/Button';

import { convertSecondsToMinutesSeconds } from '../../../../utils/helpers';
import { buttons } from '../helpers/gameStatsEntryHelperFunctions';
import { useClockContext } from '../../../../contexts/ClockContext';

const popUpOptions = [
  {
    title: 'Confirm Subs Entry',
    message: 'Do you want to enter all subs from waiting subs?',
    confirmType: 'subsConfirmed',
    btnTypes: 'YesNo',
  },
  {
    title: 'Cancel Game Stoppage',
    message:
      'Are you sure you want to cancel the stoppage? The game time will not be stopped --if there is a time difference, you need to create a stoppage.',
    confirmType: 'gameTime',
    btnTypes: 'YesNo',
  },
];
const Container = styled.div`
  width: 75%;
  height: 85%;
  border-radius: 1.2rem;
  background-color: var(--color-grey-0);
  box-shadow: var(--color-brand-100) 0px 5px 15px;
  display: flex;
  flex-direction: column;
  padding: 2.5rem;
`;
const Title = styled.div`
  display: inline-block;
  text-align: center;
  margin-top: 1rem;
`;
const Body = styled.div`
  flex: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10rem;
`;
const Footer = styled.div`
  flex: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CloseBtnContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  background-color: transparent;
  border: none;
`;
const CloseBtn = styled.button`
  background-color: transparent;
  border: none;
  font-size: 2.5rem;
  cursor: pointer;
`;
const StyledInput = styled.input`
  margin-left: 10rem;
  /* padding: 10rem; */
  width: 75%;
  height: 5rem;
`;
const StyledDiv = styled.div``;

function ModalStoppages() {
  const {
    gameData,

    stoppageHandle,
    goalHandle,
    disciplineHandle,
  } = useGameContext();
  const { players, currentPlayers, subsInWaiting, enterAllSubs } =
    usePlayerContext();
  const { currentPeriodTime } = useClockContext();

  const { stoppageStatus } = gameData;
  const [details, setDetails] = useState(stoppageStatus.details || '');
  const [popUpOpen, setPopUpOpen] = useState({
    subsConfirmed: false,
    gameTime: false,
  });
  const [goalScored, setGoalScored] = useState();
  const [discipline, setDiscipline] = useState();

  const statusType = !stoppageStatus.event
    ? false
    : stoppageStatus.event.toLowerCase().includes('goal')
    ? 'Goal'
    : stoppageStatus.event.toLowerCase().includes('card') ||
      stoppageStatus.event.toLowerCase().includes('discipline')
    ? 'Discipline'
    : stoppageStatus.event.toLowerCase().includes('injury')
    ? 'Injury'
    : 'Other';

  const stoppageTypes = buttons.filter(
    (button) => button.section === 'stoppage'
  );

  function updateClockStopped() {
    stoppageHandle.updateClockStopped();
  }
  function changeStoppageType(e) {
    stoppageHandle.updateStoppage({ event: e.target.name });
  }
  function changeTeam(e) {
    stoppageHandle.updateStoppage({ team: e.target.name });
  }
  function handleAdditionalDiscipline() {
    setDiscipline();
    //TODO
  }
  function updateDetails(e) {
    setDetails(e.target.value);
  }

  function openModal() {
    //determine if subs need to be entered
    subsInWaiting.length > 1
      ? setPopUpOpen((pop) => ({ ...pop, subsConfirmed: true }))
      : saveStoppage();
  }
  function handlePopUpClose(e) {
    const [btn, type] = e.target.name.split('-');
    if ((type === 'subsConfirmed') & (btn === 'confirmBtn')) enterAllSubs();
    setPopUpOpen((pop) => ({ ...pop, [type]: false }));
    if (type === 'gameTime' && btn === 'cancelBtn') return;
    saveStoppage();
  }
  function cancelStoppage() {
    stoppageHandle.cancelStoppage();
  }

  function saveStoppage() {
    //determine if extra data needs to be created (ie goal, discipline)
    if (stoppageStatus.event.toLowerCase().includes('goal'))
      goalHandle.createGoal(goalScored, details);
    else if (stoppageStatus.event === 'discipline')
      disciplineHandle.createDiscipline(discipline);
    else stoppageHandle.saveStoppage(details);
  }

  //todo add extra discipline

  return (
    <Container>
      {popUpOptions.map(
        (pop) =>
          popUpOpen[pop.confirmType] && (
            <PopUpConfirm
              key={pop.confirmType}
              title={pop.title}
              message={pop.message}
              onClose={handlePopUpClose}
              confirmType={pop.confirmType}
              btnTypes={pop.btnTypes}
            />
          )
      )}

      <CloseBtnContainer>
        <CloseBtn onClick={cancelStoppage}>X</CloseBtn>
      </CloseBtnContainer>
      <Title>
        <Heading case="upper">
          {stoppageStatus.event}{' '}
          {convertSecondsToMinutesSeconds(currentPeriodTime)}
          <Button
            name="clockStopped"
            size="large"
            variation={stoppageStatus.clockStopped ? 'primary' : 'secondary'}
            onClick={updateClockStopped}
          >
            {gameData.stoppageStatus.clockStopped
              ? 'Clock is Stopped'
              : 'Clock is Running'}
          </Button>
        </Heading>
        <ModalStoppagesNav
          stoppageTypes={stoppageTypes}
          changeStoppageType={changeStoppageType}
          changeTeam={changeTeam}
        />
        <StyledDiv>
          <label>
            Details
            <StyledInput
              type="text"
              id="stoppageDetails"
              onChange={updateDetails}
              value={details}
            />
          </label>
        </StyledDiv>
      </Title>
      <Body>
        {!gameData.stoppageStatus.team &&
          gameData.stoppageStatus.event !== 'other' && (
            <h2>You Must Select a Team to Continue</h2>
          )}
        {statusType &&
          (() => {
            switch (statusType) {
              case 'Goal':
                return (
                  <ActionGoal
                    team={gameData.stoppageStatus.team}
                    players={currentPlayers.onField}
                    goalScoredData={{ goalScored, setGoalScored }}
                  />
                );
              case 'Discipline':
                return (
                  <ActionDiscipline
                    team={gameData.stoppageStatus.team}
                    players={players}
                  />
                );
              case 'Injury':
                return <ActionInjury team={gameData.stoppageStatus.team} />;
              default:
                return <ActionOther team={gameData.stoppageStatus.team} />;
            }
          })()}
      </Body>
      <h2>Subs Waiting</h2>
      <Substitutions>
        <h2>
          Enter Single Sub if needed or All Subs Will Enter On Game Resume with
          confirmation
        </h2>
      </Substitutions>
      <Footer>
        <Flex>
          <Button
            name="cancelModal"
            size="xlarge"
            variation="danger"
            onClick={cancelStoppage}
          >
            Cancel Stoppage
          </Button>
          {(((gameData.stoppageStatus.team ||
            gameData.stoppageStatus.event === 'other') &&
            statusType !== 'Goal') ||
            goalScored) && (
            <>
              <Button
                name="enterDiscipline"
                size="xlarge"
                onClick={handleAdditionalDiscipline}
              >
                Add Discipline
              </Button>
              <Button
                name="saveModal"
                size="xlarge"
                variation="primary"
                onClick={openModal}
              >
                Restart Game
              </Button>
            </>
          )}
        </Flex>
      </Footer>
    </Container>
  );
}

export default ModalStoppages;
