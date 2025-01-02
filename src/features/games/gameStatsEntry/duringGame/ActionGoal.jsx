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
  const [goalTypes, setGoalTypes] = useState({ type: '', headed: false });
  const { goalScored, setGoalScored } = goalScoredData;

  function handleGoalTypeChange(e) {
    const type = categories.find(
      (cat) => cat.description === e.target.name
    ).type;
    const target = type === goalTypes.type ? null : type;
    setGoalTypes((prev) => ({ ...prev, type: target }));
    setGoalScored((prev) => ({
      ...prev,
      [target]: true,
    }));
  }
  function handleButtonClick() {
    setGoalTypes((prev) => ({ ...prev, headed: !prev?.headed }));
    setGoalScored((prev) => ({
      ...prev,
      headed: !prev?.headed || true,
    }));
  }
  function handleSelectChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    const goal = team === 'for' ? 'gf' : 'ga';

    setGoalScored((prev) => ({
      ...prev,
      goal,
      [name]: +value,
    }));
  }
  //todo on the goalscored form, we need to adjsut the pk, indirect, throwin, etc to just be one value not true false and only reflected as goal_type as that is the new column i created. also, when I click on a highlighted type, it should change back to Run of Play

  return (
    team &&
    (team === 'for' ? (
      <Column>
        <div>
          <h2>Who Scored?</h2>
          <FlexDiv>
            <Select
              width={25}
              name="scorer"
              placeholder="Select Goal Scorer"
              options={players
                .filter((player) => player.playerid !== goalScored?.assister)
                .map((player) => ({
                  value: player.playerid,
                  label: `${player.number} ${player.fullname}`,
                }))}
              value={goalScored?.scorer || ''}
              onChange={handleSelectChange}
            />
            <Select
              width={25}
              name="assister"
              placeholder="Select If there is an Assist"
              options={players
                .filter((player) => player.playerid !== goalScored?.scorer)
                .map((player) => ({
                  value: player.playerid,
                  label: `${player.number} ${player.fullname}`,
                }))}
              onChange={handleSelectChange}
              value={goalScored?.assister || ''}
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
