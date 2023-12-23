import styled from 'styled-components';

import Table from '../../ui/Table';

const Player = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;
const Flex = styled.div`
  display: flex;
  gap: 10px;
`;
const FlexLarge = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
`;
function CommunicationRow({
  player,
  onChangePlayer,
  onChangeParent,
  onChangeRow,
}) {
  const {
    player: {
      isPlayerVisible,
      playerId,
      grade,
      status,
      teamLevel,
      returningPlayer,
      isPlayerAdded,
      players: {
        people: { firstName, lastName, email },
      },
    },
  } = player;

  function handlePlayerCheck(checked) {
    onChangePlayer({ checked, email, playerId });
  } //single Player change
  function handleParentCheck(e, parent) {
    onChangeParent({
      checked: e.target.checked,
      email: parent.parentEmail,
      playerId,
      parentId: parent.parentId,
    });
  }
  function handleRowCheck(e) {
    onChangeRow(e, player);
  } //Family Clicked

  return (
    <Table.Row id={email}>
      <FlexLarge>
        <Flex>
          <div>
            <input
              id="familyCheck"
              type="checkbox"
              checked={
                player.player.isPlayerAdded &&
                player.player.parents.every((parent) => parent.isParentAdded)
              }
              onClick={handleRowCheck}
              onChange={() => {}}
            />
          </div>
          <div>Family</div>
        </Flex>
        <Flex>
          <div>
            <input
              id="parentCheck"
              type="checkbox"
              checked={player.player.parents.every(
                (parent) => parent.isParentAdded
              )}
              onClick={handleRowCheck}
              onChange={() => {}}
            />
          </div>
          <div>Parents</div>
        </Flex>
      </FlexLarge>
      <Flex>
        <div>
          <input
            type="checkbox"
            checked={isPlayerAdded}
            onChange={(e) => handlePlayerCheck(e.target.checked)}
          />
        </div>
        <Player>{`${firstName} ${lastName}`}</Player>
      </Flex>
      <div>{grade}</div>
      <div>{status}</div>
      <div>{teamLevel}</div>
      <div>{returningPlayer ? 'Yes' : 'No'}</div>
      <FlexLarge>
        {player.player.parents.map((parent) => (
          <Flex key={parent.parentId}>
            <div>
              <input
                type="checkbox"
                checked={parent.isParentAdded}
                onChange={(e) => handleParentCheck(e, parent)}
              />
            </div>
            {`${parent.parentfirstName} ${parent.parentLastName}`}
          </Flex>
        ))}
      </FlexLarge>
      <div></div>
    </Table.Row>
  );
}

export default CommunicationRow;
