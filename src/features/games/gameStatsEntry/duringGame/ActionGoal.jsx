import { useState } from 'react';
import ButtonGroup from '../../../../ui/ButtonGroup';
import Select from '../../../../ui/Select';
import Button from '../../../../ui/Button';
import styled from 'styled-components';

const FlexDiv = styled.div`
  display: flex;
  justify-content: center;
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5rem;
`;

const categories = [
  { description: 'Throw In', type: 'throwIn', team: 'both', group: 'type' },
  { description: 'Corner Kick', type: 'ck', team: 'both', group: 'type' },
  { description: 'Penalty Kick', type: 'pk', team: 'both', group: 'type' },
  {
    description: 'Direct Kick',
    type: 'directKick',
    team: 'both',
    group: 'type',
  },
  {
    description: 'Indirect Kick',
    type: 'indirectKick',
    team: 'both',
    group: 'type',
  },
  { description: 'Header', type: 'headed', team: 'own' },
];
function ActionGoal({ team, players, goalScoredData }) {
  const [onFieldPlayers, setOnFieldPlayers] = useState(
    players
      .filter((player) => player.subStatus === 1)
      .sort((a, b) => a.number - b.number)
  );
  const [goalTypes, setGoalTypes] = useState({ type: '', headed: false });
  const { goalScored, setGoalScored } = goalScoredData;

  function handleGoalTypeChange(e) {
    const type = categories.find(
      (cat) => cat.description === e.target.name
    ).type;
    const target = type === goalTypes.type ? null : type;
    setGoalTypes({ ...goalTypes, type: target });
  }
  function handleButtonClick() {
    setGoalTypes({ ...goalTypes, headed: !goalTypes.headed });
  }
  function handleSelectChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    const goal = team === 'Independence High' ? 'gf' : 'ga';
    console.log(players);
    setOnFieldPlayers(
      players
        .filter((player) => player.subStatus === 1)
        .sort((a, b) => a.number - b.number)
        .filter((player) => +value !== player.playerId)
    );
    setGoalScored((prev) => ({
      ...prev,
      goal,
      [name]: +value,
      goalTypes,
    }));
  }
  //todo on select player, add game
  //todo goal against

  return (
    team &&
    (team === 'Independence High' ? (
      <Column>
        <div>
          <h2>Who Scored?</h2>
          <FlexDiv>
            <Select
              width={25}
              name="scorer"
              options={[
                { value: 0, label: 'Select Goal Scorer' },
                ...onFieldPlayers.map((player) => ({
                  value: player.playerId,
                  label: `${player.number} ${player.fullname}`,
                })),
              ]}
              onChange={handleSelectChange}
            />
            <Select
              width={25}
              name="assister"
              options={[
                { value: 0, label: 'Select If there is an Assist' },
                ...onFieldPlayers.map((player) => ({
                  value: player.playerId,
                  label: `${player.number} ${player.fullname}`,
                })),
              ]}
              onChange={handleSelectChange}
            />
          </FlexDiv>
        </div>
        <div>
          <h2>Goal on Dead Ball?</h2>
          <ButtonGroup
            btnArray={categories
              .filter((cat) => cat.group === 'type')
              .filter((cat) => cat.team === 'both' || cat.team === 'own')
              .map((cat) => cat.description)}
            defaultBtn={
              goalTypes.type
                ? categories.find((cat) => cat.type === goalTypes.type)
                    .description
                : ''
            }
            onChange={handleGoalTypeChange}
          />
        </div>
        <div>
          <h2>Was the goal scored off a header?</h2>
          {categories
            .filter((cat) => cat.group !== 'type')
            .filter((cat) => cat.team === 'both' || cat.team === 'own')
            .map((cat) => (
              <Button
                key={cat.type}
                name={cat.type}
                value={cat.type}
                variation={goalTypes.headed ? 'primary' : 'secondary'}
                onClick={handleButtonClick}
                // type = selected
              >
                {cat.description}
              </Button>
            ))}
        </div>
      </Column>
    ) : (
      <div>TODO Goal AGainst</div>
    ))
  );
}

export default ActionGoal;