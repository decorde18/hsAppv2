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
import { useEffect, useRef, useState } from 'react';
import Button from '../../../../ui/Button';
import {
  useCreateData,
  useUpdateData,
} from '../../../../services/useUniversal';
import Input from '../../../../ui/Input';
import ButtonChecked from '../../../../ui/ButtonChecked';

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
  const { gameDetails, setGameDetails, getGameTime, buttons, currentPeriod } =
    useGameContext();
  const { activeGamePlayers, subsInWaiting, enterAllSubs } = usePlayerContext();

  const { isUpdating, updateData } = useUpdateData();
  const { isCreating, createData } = useCreateData();

  const { stoppageStatus, game } = gameDetails;
  const [details, setDetails] = useState(stoppageStatus.details || '');
  const [popUpOpen, setPopUpOpen] = useState({
    subsConfirmed: false,
    gameTime: false,
  });
  const [clockStopped, setClockStopped] = useState(true);
  const [goalScored, setGoalScored] = useState();
  const activePlayers = activeGamePlayers.current;
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
  function changeStoppageType(e) {
    //todo update db
    setGameDetails(() => ({
      ...gameDetails,
      stoppageStatus: { ...stoppageStatus, event: e.target.name },
    }));
  }
  function changeTeam(e) {
    //todo update db
    setGameDetails(() => ({
      ...gameDetails,
      stoppageStatus: { ...stoppageStatus, team: e.target.name },
    }));
  }
  function handleAdditionalDiscipline() {
    //TODO
  }
  function updateDetails(e) {
    setDetails(e.target.value);
  }
  function updateClockStopped() {
    setClockStopped((prev) => !prev);
    setGameDetails((prev) => ({
      ...prev,
      stoppageStatus: {
        ...prev.stoppageStatus,
        clockStopped: !prev.stoppageStatus.clockStopped,
      },
    }));
  }
  function saveStoppage() {
    //todo fix me - on a stoppage, all details of that stoppage will be in the stoppageStatus state/ref, goal, discipline, other, injury - will include the team, start, type, scorer, details, clockstopped etc.
    /* as the stoppage is changed, sthe stoppageStauts changes so only 1 status at a time*/
    /* save the initial reason and start time on db so that it opens up the stoppage if the screen refreshes*/
    /* on save, save GF/GA/discipline, end time on boh sheet as well as add to player stats*/
    /* */
    /* */

    const { id } = gameDetails.stoppageStatus;
    const gf =
      stoppageStatus.event === 'goal' && stoppageStatus.team === 'IHS'
        ? gameDetails.game.gf + 1
        : gameDetails.game.gf;
    const ga =
      stoppageStatus.event === 'goal' && stoppageStatus.team !== 'IHS'
        ? gameDetails.game.ga + 1
        : gameDetails.game.ga;
    const end = getGameTime();
    const eventType = gf ? 'Goal Scored' : ga ? 'Goal Against' : statusType;
    //create goal
    const { headed, type } = goalScored.goalTypes;
    const { scorer, assister } = goalScored;

    if (gf)
      createData({
        table: 'goalsFor',
        newData: {
          eventId: id,
          headed,
          scorer,
          assister: assister || null,
          ...(type !== '' && { [type]: true }),
        },
      });
    //todo discipline needs to be redone. we are currently doing red card or yellow card inside of event. need new table with discipline and details ?

    //todo do i need to update the stoppage in gamedetails as complicated as i have made it
    updateData({
      table: 'stoppages',
      newData: {
        end,
        event: eventType,
        clockStopped,
        details,
      },
      id,
    });
    setGameDetails((prev) => ({
      ...prev,
      game: { ...gameDetails.game, gf, ga },
      stoppages: [
        ...gameDetails.stoppages,
        {
          end,
          ...stoppageStatus,
        },
      ],
    }));

    // if no subsinwaiting, closemodal after
    subsInWaiting.length > 1
      ? setPopUpOpen((pop) => ({ ...pop, subsConfirmed: true }))
      : closeModal();
    //todo delete or save stoppage
  }
  function cancelStoppage() {
    // popup with was time paused? (on Cancel)
    setPopUpOpen((pop) => ({ ...pop, gameTime: true }));
  }
  function closeModal() {
    setGameDetails((prev) => ({ ...prev, stoppageStatus: false }));
  }
  function handlePopUpClose(e) {
    const [btn, type] = e.target.name.split('-');
    if ((type === 'subsConfirmed') & (btn === 'confirmBtn')) enterAllSubs();
    setPopUpOpen((pop) => ({ ...pop, [type]: false }));
    if (type === 'gameTime' && btn === 'cancelBtn') return;
    closeModal();
  }
  //todo add, clockstopped, time elapsed,
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
        <CloseBtn onClick={closeModal}>X</CloseBtn>
      </CloseBtnContainer>
      <Title>
        <Heading case="upper">
          {stoppageStatus.event} {stoppageStatus.begin}
          <Button
            name="clockStopped"
            size="large"
            variation={stoppageStatus.clockStopped ? 'primary' : 'secondary'}
            onClick={updateClockStopped}
          >
            {gameDetails.stoppageStatus.clockStopped
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
        {!gameDetails.stoppageStatus.team &&
          gameDetails.stoppageStatus.event !== 'other' && (
            <h2>You Must Select a Team to Continue</h2>
          )}
        {statusType &&
          (() => {
            switch (statusType) {
              case 'Goal':
                return (
                  <ActionGoal
                    team={gameDetails.stoppageStatus.team}
                    players={activePlayers}
                    goalScoredData={{ goalScored, setGoalScored }}
                  />
                );
              case 'Discipline':
                return (
                  <ActionDiscipline
                    team={gameDetails.stoppageStatus.team}
                    players={activePlayers}
                  />
                );
              case 'Injury':
                return <ActionInjury team={gameDetails.stoppageStatus.team} />;
              default:
                return <ActionOther team={gameDetails.stoppageStatus.team} />;
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
        {(gameDetails.stoppageStatus.team ||
          gameDetails.stoppageStatus.event === 'other') && (
          <Flex>
            <Button
              name="cancelModal"
              size="xlarge"
              variation="danger"
              onClick={cancelStoppage}
            >
              Cancel Stoppage
            </Button>
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
              onClick={saveStoppage}
            >
              Restart Game
            </Button>
          </Flex>
        )}
      </Footer>
    </Container>
  );
}

export default ModalStoppages;
