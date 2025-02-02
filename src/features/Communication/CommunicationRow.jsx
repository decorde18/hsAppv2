import styled from 'styled-components';
import Table from '../../ui/Table';
import { convertSBdateToLocalDate } from '../../utils/helpers';

// Styled component for player name
const Player = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

// Flex container with gap
const Flex = styled.div`
  display: flex;
  gap: 10px;
`;

// Grid layout for better structure
const FlexLarge = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  gap: 1rem;
`;

function CommunicationRow({
  player,
  onChangePlayer,
  onChangeParent,
  onChangeRow,
  familyChecked,
  parentsChecked,
  playerChecked,
  parentEmails,
}) {
  // Extract necessary player details
  const {
    player: {
      playerId,
      grade,
      status,
      teamLevel,
      returningPlayer,
      fullname,
      email,
      created_at,
      parents = [], // Default to an empty array
    },
  } = player;

  // Handle player checkbox toggle
  function handlePlayerCheck(checked) {
    onChangePlayer({ checked, email, playerId });
  }

  // Handle parent checkbox toggle
  function handleParentCheck(e, parent) {
    onChangeParent({
      checked: e.target.checked,
      email: parent.email,
      playerId,
      parentId: parent.id,
    });
  }

  // Handle entire family row checkbox toggle
  function handleRowCheck(e) {
    onChangeRow({ name: e.target.name, checked: e.target.checked, ...player });
  }

  return (
    <Table.Row id={email}>
      {/* Family and Parents selection */}
      <FlexLarge>
        <Flex>
          <input
            name="family"
            type="checkbox"
            checked={familyChecked}
            onClick={handleRowCheck}
            readOnly // Prevents console warnings
          />
          <div>Family</div>
        </Flex>
        <Flex>
          <input
            name="parents"
            type="checkbox"
            checked={parentsChecked}
            onClick={handleRowCheck}
            readOnly
          />
          <div>Parents</div>
        </Flex>
      </FlexLarge>

      {/* Player selection */}
      <Flex>
        <input
          type="checkbox"
          checked={playerChecked}
          onChange={(e) => handlePlayerCheck(e.target.checked)}
        />
        <Player>{fullname}</Player>
      </Flex>

      {/* Player attributes */}
      <div>{grade}</div>
      <div>{convertSBdateToLocalDate(created_at)}</div>
      <div>{status}</div>
      <div>{teamLevel}</div>
      <div>{returningPlayer ? 'Yes' : 'No'}</div>

      {/* Parent selection */}
      <FlexLarge>
        {parents.map((parent) => (
          <Flex key={`${playerId}-${parent.id}`}>
            <input
              type="checkbox"
              checked={parentEmails.some((p) => p.id === parent.id)}
              onChange={(e) => handleParentCheck(e, parent)}
            />
            {parent.fullname}
          </Flex>
        ))}
      </FlexLarge>

      {/* Empty column for layout consistency */}
      <div></div>
    </Table.Row>
  );
}

export default CommunicationRow;
